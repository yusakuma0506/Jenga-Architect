import { prisma } from "@/lib/prisma";
import QuizContainer from "@/components/QuizContainer";
import { notFound, redirect } from "next/navigation";
import { Level } from "@prisma/client";
import { canAccessLevel, getAuthenticatedUser, parseLevel } from "@/lib/user";
import { publicQuizSelect } from "@/lib/quiz";
import { MAX_SOLO_QUIZ_LIMIT } from "@/lib/validation";

function shuffleQuizzes<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface PageProps {
  params: Promise<{ level: string }>;
  searchParams: Promise<{ limit?: string }>;
}

export default async function SoloPlayPage({ params, searchParams }: PageProps) {
  const { level } = await params;
  const { limit } = await searchParams;
  const parsedLevel = parseLevel(level);

  if (!parsedLevel) {
    return notFound();
  }

  const dbUser = await getAuthenticatedUser();
  if (!dbUser) {
    redirect("/api/auth/signin");
  }

  if (!canAccessLevel(dbUser, parsedLevel)) {
    redirect("/subscription");
  }

  const allQuizzes = await prisma.quiz.findMany({
    where: { level: parsedLevel as Level },
    select: publicQuizSelect,
  });

  if (allQuizzes.length === 0) {
    return <div className="p-10 text-center">No questions found.</div>;
  }

  const requestedLimit = Number(limit) || 10;
  const cappedLimit = Math.min(
    Math.max(1, requestedLimit),
    MAX_SOLO_QUIZ_LIMIT,
    allQuizzes.length
  );

  const shuffled = shuffleQuizzes(allQuizzes);
  const finalSelection = shuffled.slice(0, cappedLimit);

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black text-center mb-8 uppercase">{level} Build</h1>
        <QuizContainer quizzes={finalSelection} />
      </div>
    </main>
  );
}
