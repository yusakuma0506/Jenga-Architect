'use server';

import { Level } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkQuizAnswer } from '@/lib/quiz';
import { advanceTurn, isPlayerTurn } from '@/lib/room-turn';
import {
  getCorrectPoints,
  MAX_QUIZ_ATTEMPTS,
  WRONG_ANSWER_PENALTY,
} from '@/lib/multiplayer-scoring';

type AttemptQuizInput = {
  quizId: string;
  roomCode: string;
  selected: number[];
};

export async function attemptQuizAnswer(input: AttemptQuizInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  if (
    !Array.isArray(input.selected) ||
    input.selected.some((n) => !Number.isInteger(n) || n < 0)
  ) {
    return { success: false, error: 'Invalid answer' };
  }

  const room = await prisma.room.findUnique({
    where: { joinCode: input.roomCode },
    select: { id: true, status: true, level: true },
  });

  if (!room || room.status !== 'PLAYING') {
    return { success: false, error: 'Room is not in play' };
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
    return { success: false, error: 'Not in this room' };
  }

  if (participant.isEliminated) {
    return { success: false, error: 'You are out of the game' };
  }

  const turnAllowed = await isPlayerTurn(room.id, session.user.id);
  if (!turnAllowed) {
    return { success: false, error: 'Not your turn' };
  }

  const priorAttempts = await prisma.quizAttempt.findMany({
    where: {
      roomId: room.id,
      userId: session.user.id,
      quizId: input.quizId,
    },
    orderBy: { attemptNumber: 'asc' },
  });

  if (priorAttempts.some((attempt) => attempt.isCorrect)) {
    return {
      success: false,
      error: 'You already solved this block',
      alreadySolved: true,
    };
  }

  if (priorAttempts.length >= MAX_QUIZ_ATTEMPTS) {
    return {
      success: false,
      error: 'No attempts remaining',
      attemptsUsed: MAX_QUIZ_ATTEMPTS,
      attemptsRemaining: 0,
    };
  }

  const attemptNumber = priorAttempts.length + 1;
  const isCorrect = await checkQuizAnswer(input.quizId, input.selected);
  const pointsChange = isCorrect
    ? getCorrectPoints(room.level as Level)
    : -WRONG_ANSWER_PENALTY;

  try {
    await prisma.$transaction([
      prisma.quizAttempt.create({
        data: {
          roomId: room.id,
          userId: session.user.id,
          quizId: input.quizId,
          attemptNumber,
          isCorrect,
          pointsChange,
        },
      }),
      prisma.roomParticipant.update({
        where: {
          roomId_userId: {
            roomId: room.id,
            userId: session.user.id,
          },
        },
        data: {
          totalScore: { increment: pointsChange },
        },
      }),
    ]);

    const updatedParticipant = await prisma.roomParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId: room.id,
          userId: session.user.id,
        },
      },
      select: { totalScore: true },
    });

    const completed = isCorrect || attemptNumber >= MAX_QUIZ_ATTEMPTS;
    if (completed) {
      await advanceTurn(room.id);
    }

    return {
      success: true,
      correct: isCorrect,
      pointsChange,
      newTotalScore: updatedParticipant?.totalScore ?? 0,
      attemptsUsed: attemptNumber,
      attemptsRemaining: isCorrect
        ? 0
        : Math.max(0, MAX_QUIZ_ATTEMPTS - attemptNumber),
      completed,
    };
  } catch {
    return { success: false, error: 'Failed to record attempt' };
  }
}

export async function breakTower(roomCode: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const room = await prisma.room.findUnique({
    where: { joinCode: roomCode },
    select: { id: true, status: true },
  });

  if (!room || room.status !== 'PLAYING') {
    return { success: false, error: 'Room is not in play' };
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
    return { success: false, error: 'Not in this room' };
  }

  if (participant.isEliminated) {
    return { success: false, error: 'You already broke the tower' };
  }

  await prisma.roomParticipant.update({
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
  });

  return { success: true };
}
