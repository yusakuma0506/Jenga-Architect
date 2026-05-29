import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Failed to start game.';
}

export async function PATCH(
  _request: NextRequest,
  context: { params: Promise<{ roomCode: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized — please sign in again.' }, { status: 401 });
  }

  const { roomCode } = await context.params;

  try {
    const room = await prisma.room.findUnique({
      where: { joinCode: roomCode },
      select: { id: true, ownerId: true, status: true },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
    }

    if (room.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Only the host can start the game.' }, { status: 403 });
    }

    if (room.status === 'PLAYING') {
      return NextResponse.json({ ok: true, alreadyStarted: true });
    }

    const firstPlayer = await prisma.roomParticipant.findFirst({
      where: { roomId: room.id },
      orderBy: { joinedAt: 'asc' },
      select: { userId: true },
    });

    if (!firstPlayer) {
      return NextResponse.json({ error: 'No players in the room.' }, { status: 400 });
    }

    const updatedRoom = await prisma.room.update({
      where: { id: room.id },
      data: {
        status: 'PLAYING',
        currentTurnUserId: firstPlayer.userId,
      },
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('PATCH /start error:', error);
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
