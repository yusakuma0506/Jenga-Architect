'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { isAllowedProfileImageUrl } from '@/lib/validation';

export async function updateUsername(userId: string, newName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.id !== userId) {
    return { error: 'Unauthorized' };
  }

  const trimmed = newName.trim();
  if (trimmed.length < 1 || trimmed.length > 20) {
    return { error: 'Invalid name' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: trimmed },
    });
    revalidatePath('/');
    return { success: true };
  } catch {
    return { error: 'Failed' };
  }
}

export async function updatePhoto(userId: string, newPhoto: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.id !== userId) {
    return { error: 'Unauthorized' };
  }

  if (!isAllowedProfileImageUrl(newPhoto)) {
    return { error: 'Invalid image URL' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image: newPhoto },
    });
    revalidatePath('/');
    return { success: true };
  } catch {
    return { error: 'Failed' };
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (stripe && user?.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'all',
        limit: 10,
      });

      const activeSubscriptions = subscriptions.data.filter((subscription) =>
        ['active', 'trialing', 'past_due'].includes(subscription.status)
      );

      await Promise.all(
        activeSubscriptions.map((subscription) =>
          stripe.subscriptions.cancel(subscription.id)
        )
      );
    }

    await prisma.$transaction([
      prisma.room.deleteMany({ where: { ownerId: userId } }),
      prisma.roomParticipant.deleteMany({ where: { userId } }),
      prisma.feedback.deleteMany({ where: { userId } }),
      prisma.userScore.deleteMany({ where: { userId } }),
      prisma.subscription.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Could not delete account' };
  }
}
