import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export function getStripeConfigStatus() {
  const missing = [];

  if (!process.env.STRIPE_SECRET_KEY?.trim()) missing.push("STRIPE_SECRET_KEY");
  if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY?.trim()) {
    missing.push("NEXT_PUBLIC_STRIPE_PRICE_MONTHLY");
  }
  if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_3MONTHS?.trim()) {
    missing.push("NEXT_PUBLIC_STRIPE_PRICE_3MONTHS");
  }
  if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL?.trim()) {
    missing.push("NEXT_PUBLIC_STRIPE_PRICE_ANNUAL");
  }

  return {
    configured: missing.length === 0,
    missing,
  };
}

export const STRIPE_PRICE_IDS = new Set([
  "price_1TWtSCRtHNDHszzOCkL5QxOl",
  "price_1TWtSCRtHNDHszzOioT5LZYn",
  "price_1TWtSCRtHNDHszzOkocNJ9lD",
]);

export function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const subscriptionItem = subscription.items.data[0];
  return new Date(
    (subscriptionItem?.current_period_end ?? Math.floor(Date.now() / 1000)) * 1000
  );
}
