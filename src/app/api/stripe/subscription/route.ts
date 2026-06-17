import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripeConfigStatus, stripe, STRIPE_PRICE_IDS } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function cleanBaseUrl(url?: string | null) {
  return url?.trim().replace(/\/$/, '');
}

function isLocalUrl(url?: string | null) {
  return Boolean(url && /\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(url));
}

function getRequestBaseUrl(request: Request) {
  const origin = cleanBaseUrl(request.headers.get('origin'));
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';

  if (origin) return origin;
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;

  return null;
}

function getCheckoutBaseUrl(request: Request) {
  const configuredBaseUrl = cleanBaseUrl(process.env.NEXT_PUBLIC_BASE_URL);
  if (configuredBaseUrl) return configuredBaseUrl;

  const requestBaseUrl = getRequestBaseUrl(request);
  const nextAuthUrl = cleanBaseUrl(process.env.NEXTAUTH_URL);

  if (nextAuthUrl && (!isLocalUrl(nextAuthUrl) || isLocalUrl(requestBaseUrl))) {
    return nextAuthUrl;
  }

  return requestBaseUrl ?? 'http://localhost:3000';
}

export async function GET() {
  return NextResponse.json(getStripeConfigStatus());
}

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        {
          error: 'Stripe is not configured',
          ...getStripeConfigStatus(),
        },
        { status: 500 }
      );
    }

    const sessionUser = await getServerSession(authOptions);
    if (!sessionUser?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await request.json();
    if (!STRIPE_PRICE_IDS.has(priceId)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        stripeCustomerId: true,
      },
    });

    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unavailable' }, { status: 403 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    const baseUrl = getCheckoutBaseUrl(request);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      customer: stripeCustomerId,
      client_reference_id: user.id,
      metadata: { userId: user.id, priceId },
      subscription_data: {
        metadata: { userId: user.id, priceId },
      },
      success_url: `${baseUrl}/subscription?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscription?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
