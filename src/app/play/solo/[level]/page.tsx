import { prisma } from "@/lib/prisma";
import QuizContainer from "@/components/QuizContainer";
import { notFound } from "next/navigation";
import { Level } from "@prisma/client";

// 1. Move the shuffle logic OUTSIDE the component
// This makes the component itself "pure" because it just calls a helper
function shuffleQuizzes(array: any[]) {
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

  const validLevels = ["entry", "junior", "senior"];
  if (!validLevels.includes(level.toLowerCase())) {
    return notFound();
  }

  const allQuizzes = await prisma.quiz.findMany({
    where: {
      level: level.toUpperCase() as Level,
    },
  });

  if (allQuizzes.length === 0) {
    return <div className="p-10 text-center">No questions found.</div>;
  }

  // 2. Call the helper function here
  const shuffled = shuffleQuizzes(allQuizzes);
  const finalSelection = shuffled.slice(0, Number(limit) || 10);

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black text-center mb-8 uppercase">
            {level} Build
        </h1>
        <QuizContainer quizzes={finalSelection} />
      </div>
    </main>
  );
}