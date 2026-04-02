import {prisma} from "@/lib/prisma";
import QuizContainer from "@/components/QuizContainer";

export default async function QuizPage({ params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;
  const quizzes = await prisma.quiz.findMany({ where: { blockId } });

  // ここで一度だけ呼び出す！
  return (
    <QuizContainer quizzes={quizzes} />
  );
}