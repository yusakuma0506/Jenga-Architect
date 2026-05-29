import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isPlayerTurn } from '@/lib/room-turn';
import { computeStandings } from '@/lib/multiplayer-scoring';

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ roomCode: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { roomCode } = await context.params;

  const room = await prisma.room.findUnique({
    where: { joinCode: roomCode },
    select: { id: true, status: true },
  });

  if (!room || room.status !== 'PLAYING') {
    return NextResponse.json({ error: 'Room is not in play' }, { status: 400 });
  }

  const isTurn = await isPlayerTurn(room.id, session.user.id);
  if (!isTurn) {
    return NextResponse.json({ error: 'Not your turn' }, { status: 403 });
  }

  const participant = await prisma.roomParticipant.findUnique({
    where: {
      roomId_userId: {
        roomId: room.id,
        userId: session.user.id,
      },
    },
  });

  if (!participant) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (participant.isEliminated) {
    return NextResponse.json({ error: 'Already eliminated' }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.roomParticipant.update({
      where: {
        roomId_userId: {
          roomId: room.id,
          userId: session.user.id,
        },
      },
      data: {
        isEliminated: true,
        eliminatedAt: new Date(),
      },
    }),
    prisma.room.update({
      where: { id: room.id },
      data: {
        status: 'FINISHED',
        currentTurnUserId: null,
      },
    }),
  ]);

  const participants = await prisma.roomParticipant.findMany({
    where: { roomId: room.id },
    include: { user: true },
  });

  const standings = computeStandings(
    participants.map((p) => ({
      userId: p.userId,
      name: p.user.name?.split(' ')[0] ?? 'PLAYER',
      image: p.user.image,
      totalScore: p.totalScore,
      isEliminated: p.isEliminated,
    }))
  );

  return NextResponse.json({ success: true, status: 'FINISHED', standings });
}
