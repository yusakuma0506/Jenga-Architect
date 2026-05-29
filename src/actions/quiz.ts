'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkQuizAnswer } from '@/lib/quiz';

export async function verifyQuizAnswer(quizId: string, selected: number[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { correct: false, error: 'Unauthorized' };
  }

  if (!Array.isArray(selected) || selected.some((n) => !Number.isInteger(n) || n < 0)) {
    return { correct: false, error: 'Invalid answer' };
  }

  const correct = await checkQuizAnswer(quizId, selected);
  return { correct };
}
