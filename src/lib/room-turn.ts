import { prisma } from '@/lib/prisma';

export async function getActiveParticipantsOrdered(roomId: string) {
  return prisma.roomParticipant.findMany({
    where: { roomId, isEliminated: false },
    orderBy: { joinedAt: 'asc' },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });
}

export async function initializeTurn(roomId: string) {
  const active = await getActiveParticipantsOrdered(roomId);
  if (active.length === 0) return null;

  await prisma.room.update({
    where: { id: roomId },
    data: { currentTurnUserId: active[0].userId },
  });

  return active[0].userId;
}

export async function advanceTurn(roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { currentTurnUserId: true },
  });

  const active = await getActiveParticipantsOrdered(roomId);
  if (active.length === 0) {
    await prisma.room.update({
      where: { id: roomId },
      data: { currentTurnUserId: null },
    });
    return null;
  }

  if (active.length === 1) {
    await prisma.room.update({
      where: { id: roomId },
      data: { currentTurnUserId: active[0].userId },
    });
    return active[0].userId;
  }

  const currentIndex = active.findIndex((p) => p.userId === room?.currentTurnUserId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % active.length;
  const nextUserId = active[nextIndex].userId;

  await prisma.room.update({
    where: { id: roomId },
    data: { currentTurnUserId: nextUserId },
  });

  return nextUserId;
}

export async function isPlayerTurn(roomId: string, userId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { currentTurnUserId: true, status: true },
  });

  if (!room || room.status !== 'PLAYING') return false;
  return room.currentTurnUserId === userId;
}

export async function assertPlayerTurn(roomId: string, userId: string) {
  const allowed = await isPlayerTurn(roomId, userId);
  if (!allowed) {
    throw new Error('NOT_YOUR_TURN');
  }
}
