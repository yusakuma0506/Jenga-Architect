import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/user';
import { publicQuizSelect } from '@/lib/quiz';
import { MAX_QUIZ_ATTEMPTS } from '@/lib/multiplayer-scoring';
import { isPlayerTurn } from '@/lib/room-turn';
import MultiQuizClient from '@/components/MultiQuizClient';

export default async function MultiQuizPage({
  params,
}: {
  params: Promise<{ roomCode: string; blockId: string }>;
}) {
  const { roomCode, blockId } = await params;
  const session = await getSessionUser();

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const room = await prisma.room.findUnique({
    where: { joinCode: roomCode },
    include: {
      participants: { select: { userId: true, isEliminated: true } },
    },
  });

  if (!room) return notFound();

  if (room.status !== 'PLAYING') {
    redirect(`/play/multi/${roomCode}`);
  }

  const participant = room.participants.find((p) => p.userId === session.user.id);
  if (!participant) {
    redirect('/');
  }

  if (participant.isEliminated) {
    redirect(`/play/multi/${roomCode}/board`);
  }

  const turnAllowed = await isPlayerTurn(room.id, session.user.id);
  if (!turnAllowed) {
    redirect(`/play/multi/${roomCode}/board`);
  }

  const solvedCount = await prisma.quizAttempt.count({
    where: {
      roomId: room.id,
      isCorrect: true,
      quiz: { blockId },
    },
  });

  const currentSubIndex = solvedCount + 1;

  const quizData = await prisma.quiz.findFirst({
    where: {
      blockId,
      level: room.level,
      subIndex: currentSubIndex,
    },
    select: publicQuizSelect,
  });

  if (!quizData) {
    return (
      <div className="p-10 text-center font-bold">
        No more questions for this block!
      </div>
    );
  }

  const priorAttempts = await prisma.quizAttempt.findMany({
    where: {
      roomId: room.id,
      userId: session.user.id,
      quizId: quizData.id,
    },
  });

  const alreadySolved = priorAttempts.some((a) => a.isCorrect);
  if (alreadySolved) {
    redirect(`/play/multi/${roomCode}/board`);
  }

  const attemptsUsed = priorAttempts.length;
  const attemptsRemaining = Math.max(0, MAX_QUIZ_ATTEMPTS - attemptsUsed);

  return (
    <div className="py-10 px-4">
      <div className="text-center mb-6">
        <span className="bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          {room.level} · {blockId}
        </span>
      </div>
      <MultiQuizClient
        quiz={quizData}
        roomCode={roomCode}
        level={room.level}
        attemptsRemaining={attemptsRemaining}
        attemptsUsed={attemptsUsed}
      />
    </div>
  );
}
