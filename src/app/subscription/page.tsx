import { redirect } from 'next/navigation';
import Link from 'next/link';
import { confirmCheckoutSession } from '@/lib/subscription';
import { getSessionUser } from '@/lib/user';
import { prisma } from '@/lib/prisma';
import SubscriptionPanel from './SubscriptionPanel';

type SubscriptionPageProps = {
  searchParams: Promise<{
    session_id?: string;
    success?: string;
  }>;
};

export default async function SubscriptionPage({ searchParams }: SubscriptionPageProps) {
  const session = await getSessionUser();

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const { session_id: sessionId, success } = await searchParams;

  if (success === '1' && sessionId) {
    await confirmCheckoutSession(sessionId, session.user.id);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      isPro: true,
      subscription: {
        select: {
          priceId: true,
          currentPeriodEnd: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/api/auth/signin');
  }

  if (user.role === 'ADMIN') {
    redirect('/');
  }

  return (
    <main className="min-h-svh bg-white text-slate-900 font-sans">
      <div className="fixed inset-0 opacity-40 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative z-10 flex min-h-svh items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative flex w-full flex-col items-center gap-4">
          <SubscriptionPanel currentPriceId={user.subscription?.priceId} isPro={user.isPro} />
          {user.isPro && user.subscription?.currentPeriodEnd && (
            <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-white/80">
              Pro access valid until {user.subscription.currentPeriodEnd.toLocaleDateString()}
            </p>
          )}
          <Link href="/" className="text-sm font-bold text-white/80 hover:text-white">
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
