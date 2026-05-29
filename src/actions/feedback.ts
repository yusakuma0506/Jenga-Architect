'use server';

import { revalidatePath } from 'next/cache';
import { FeedbackType } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MAX_FEEDBACK_LENGTH } from '@/lib/validation';

export async function createNewFeedback(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in to send feedback' };
  }

  const content = (formData.get('content') as string)?.trim() ?? '';
  const rawType = formData.get('type') as FeedbackType;

  if (!content || content.length > MAX_FEEDBACK_LENGTH) {
    return { success: false, error: 'Invalid feedback content' };
  }

  const feedbackType = Object.values(FeedbackType).includes(rawType as FeedbackType)
    ? (rawType as FeedbackType)
    : FeedbackType.OTHER;

  try {
    const newEntry = await prisma.feedback.create({
      data: {
        content,
        type: feedbackType,
        read: false,
        userId: session.user.id,
      },
    });
    return { success: true, id: newEntry.id };
  } catch {
    return { success: false, error: 'Failed to save feedback' };
  }
}

export async function feedbackReadUpdate(feedbackId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    return { success: false, error: 'Forbidden' };
  }

  try {
    await prisma.feedback.update({
      where: { id: feedbackId },
      data: { read: true },
    });
    revalidatePath('/feedback');
    return { success: true };
  } catch {
    return { success: false };
  }
}
