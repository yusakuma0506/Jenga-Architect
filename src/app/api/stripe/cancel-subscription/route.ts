import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubscriptionPeriodEnd, stripe } from '@/lib/stripe';

export async function POST() {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        isPro: true,
        stripeCustomerId: true,
        subscription: true,
      },
    });

    if (!user || user.role === 'ADMIN' || !user.isPro || !user.stripeCustomerId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'all',
      limit: 10,
    });

    const activeSubscription = subscriptions.data.find((subscription) =>
      ['active', 'trialing', 'past_due'].includes(subscription.status)
    );

    if (!activeSubscription) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    const canceledSubscription = await stripe.subscriptions.update(activeSubscription.id, {
      cancel_at_period_end: true,
    });

    const currentPeriodEnd = getSubscriptionPeriodEnd(canceledSubscription);
    const priceId =
      canceledSubscription.items.data[0]?.price.id ?? user.subscription?.priceId ?? '';

    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        status: canceledSubscription.status,
        priceId,
        currentPeriodEnd,
      },
      update: {
        status: canceledSubscription.status,
        priceId,
        currentPeriodEnd,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { isPro: currentPeriodEnd > new Date() },
    });

    return NextResponse.json({ success: true, currentPeriodEnd });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
