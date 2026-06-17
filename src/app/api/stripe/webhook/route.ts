import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { syncSubscription } from '@/lib/subscription';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getStripeWebhookConfig() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const missing = [];

  if (!stripe) missing.push('STRIPE_SECRET_KEY');
  if (!webhookSecret) missing.push('STRIPE_WEBHOOK_SECRET');

  return { webhookSecret, missing };
}

export async function GET() {
  const { missing } = getStripeWebhookConfig();

  return NextResponse.json({
    configured: missing.length === 0,
    missing,
  });
}

export async function POST(request: Request) {
  const { webhookSecret, missing } = getStripeWebhookConfig();

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook is not configured', missing },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature error:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (typeof session.subscription === 'string') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await syncSubscription(subscription, session.client_reference_id);
        }

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook sync error:', error);
    return NextResponse.json({ error: 'Webhook sync failed' }, { status: 500 });
  }
}
