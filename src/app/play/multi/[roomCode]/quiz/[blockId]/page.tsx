import { prisma } from "@/lib/prisma";
import MultiQuizClient from "@/components/MultiQuizClient";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/user";
import { publicQuizSelect } from "@/lib/quiz";
import { MAX_QUIZ_ATTEMPTS } from "@/lib/multiplayer-scoring";

export default async function MultiQuizPage({
  params,
}: {
  params: Promise<{ roomCode: string; blockId: string }>;
}) {
  const { roomCode, blockId } = await params;
  const session = await getSessionUser();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // 1. Fetch Room to find the selected Level (ENTRY/JUNIOR/SENIOR)
  const room = await prisma.room.findUnique({
    where: { joinCode: roomCode },
    include: {
      participants: { select: { userId: true, isEliminated: true } },
    },
  });

  if (!room) return notFound();

  if (room.status !== "PLAYING") {
    redirect(`/play/multi/${roomCode}`);
  }

  const participant = room.participants.find((p) => p.userId === session.user.id);
  if (!participant || participant.isEliminated) {
    redirect(`/play/multi/${roomCode}/board`);
  }

  if (room.currentTurnUserId !== session.user.id) {
    redirect(`/play/multi/${roomCode}/board`);
  }

  // 2. Determine SubIndex: Count scores for this block in this room
  // This logic ensures that if BLOCK-01 is pulled twice, the 2nd pull gets subIndex 2.
  const completedAttempts = await prisma.quizAttempt.count({
    where: {
      roomId: room.id,
      quiz: { blockId },
      OR: [{ isCorrect: true }, { attemptNumber: MAX_QUIZ_ATTEMPTS }],
    },
  });

  const currentSubIndex = completedAttempts + 1;

  // 3. Fetch the Quiz
  const quizData = await prisma.quiz.findFirst({
    where: {
      blockId,
      level: room.level, // Uses the level chosen by the host
      subIndex: currentSubIndex,
    },
    select: publicQuizSelect,
  });

  if (!quizData) return <div className="p-10 text-center">No more questions for this block!</div>;

  const attemptsUsed = await prisma.quizAttempt.count({
    where: {
      roomId: room.id,
      userId: session.user.id,
      quizId: quizData.id,
    },
  });

  return (
    <div className="py-10">
      <div className="text-center mb-8">
        <span className="bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          {room.level} Mode
        </span>
      </div>
      
      <MultiQuizClient
        quiz={quizData} 
        roomCode={roomCode}
        level={room.level}
        attemptsUsed={attemptsUsed}
        attemptsRemaining={Math.max(0, MAX_QUIZ_ATTEMPTS - attemptsUsed)}
      />
    </div>
  );
}
