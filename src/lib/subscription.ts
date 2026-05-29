import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getSubscriptionPeriodEnd, stripe } from "@/lib/stripe";

export async function syncSubscription(
  subscription: Stripe.Subscription,
  fallbackUserId?: string | null
) {
  const userId = subscription.metadata.userId || fallbackUserId;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const currentPeriodEnd = getSubscriptionPeriodEnd(subscription);
  const priceId = subscription.items.data[0]?.price.id ?? "";
  const isPro =
    ["active", "trialing"].includes(subscription.status) &&
    currentPeriodEnd > new Date();

  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
    : await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });

  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { isPro, stripeCustomerId: customerId },
  });

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      status: subscription.status,
      priceId,
      currentPeriodEnd,
    },
    update: {
      status: subscription.status,
      priceId,
      currentPeriodEnd,
    },
  });
}

export async function confirmCheckoutSession(sessionId: string, userId: string) {
  if (!stripe) return;

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (
    checkoutSession.client_reference_id !== userId ||
    typeof checkoutSession.subscription !== "string"
  ) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    checkoutSession.subscription
  );
  await syncSubscription(subscription, userId);
}
