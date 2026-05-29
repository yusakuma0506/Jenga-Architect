import { redirect } from 'next/navigation';
import MultiplaySelector from '@/components/MultiplaySelector';
import { getAuthenticatedUser } from '@/lib/user';

export default async function MultiplayPortal() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/api/auth/signin');
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-[4px] border-slate-900 rounded-[40px] p-8 shadow-[12px_12px_0_0_#0f172a]">
        <h1 className="text-2xl font-black text-slate-900 mb-6 text-center">Multiplayer</h1>
        <MultiplaySelector isPro={user.isPro} role={user.role} />
      </div>
    </main>
  );
}
