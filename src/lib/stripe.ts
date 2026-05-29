import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

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
