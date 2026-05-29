import { prisma } from "@/lib/prisma";

export type PublicQuiz = {
  id: string;
  question: string;
  options: string[];
};

export const publicQuizSelect = {
  id: true,
  question: true,
  options: true,
} as const;

function answersMatch(correct: number[], selected: number[]): boolean {
  if (correct.length !== selected.length) return false;
  return correct.every((value, index) => value === selected[index]);
}

export async function checkQuizAnswer(
  quizId: string,
  selected: number[]
): Promise<boolean> {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { answer: true },
  });
  if (!quiz) return false;
  return answersMatch(quiz.answer, selected);
}
