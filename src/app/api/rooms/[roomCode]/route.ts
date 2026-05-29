import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { computeStandings } from '@/lib/multiplayer-scoring';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ roomCode: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { roomCode } = await context.params;

  const room = await prisma.room.findUnique({
    where: { joinCode: roomCode },
    include: {
      participants: { include: { user: true } },
      owner: true,
    },
  });

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  const isParticipant = room.participants.some(
    (p) => p.userId === session.user.id
  );
  if (!isParticipant) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const turnPlayer = room.currentTurnUserId
    ? room.participants.find((p) => p.userId === room.currentTurnUserId)?.user ?? null
    : null;

  const standings = computeStandings(
    room.participants.map((p) => ({
      userId: p.userId,
      name: p.user.name?.split(' ')[0] ?? 'PLAYER',
      image: p.user.image,
      totalScore: p.totalScore,
      isEliminated: p.isEliminated,
    }))
  );

  return NextResponse.json({
    ...room,
    standings,
    turnPlayer: turnPlayer
      ? { id: turnPlayer.id, name: turnPlayer.name }
      : null,
  });
}
