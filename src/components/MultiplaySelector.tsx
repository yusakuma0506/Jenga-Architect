'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isPremiumLevel } from '@/lib/levels';

type MultiplaySelectorProps = {
  isPro: boolean;
  role: string;
};

export default function MultiplaySelector({ isPro, role }: MultiplaySelectorProps) {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [isLoad, setIsLoad] = useState(false);
  const [isJoinLoad, setIsJoinLoad] = useState(false);

  const canHostPremium = isPro || role === 'ADMIN';

  const handleHost = async (level: string) => {
    if (isPremiumLevel(level) && !canHostPremium) {
      alert('Pro plan required to host Junior and Senior rooms.');
      return;
    }

    setIsLoad(true);
    const res = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? 'Failed to create room.');
      setIsLoad(false);
      return;
    }

    const data = await res.json();
    sessionStorage.setItem('activeRoomCode', data.joinCode);
    router.push(`/play/multi/${data.joinCode}`);
  };

  const handleJoin = async () => {
    if (joinCode.length !== 8) return;

    setIsJoinLoad(true);
    const res = await fetch('/api/rooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ joinCode: joinCode.toUpperCase() }),
    });

    if (res.ok) {
      sessionStorage.setItem('activeRoomCode', joinCode.toUpperCase());
      router.push(`/play/multi/${joinCode.toUpperCase()}`);
    } else {
      alert('Room not found!');
      setIsJoinLoad(false);
    }
  };

  const levels = [
    { id: 'ENTRY', label: 'Easy', points: 200, proOnly: false },
    { id: 'JUNIOR', label: 'Medium', points: 300, proOnly: true },
    { id: 'SENIOR', label: 'Hard', points: 400, proOnly: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-slate-900 font-black mb-3">MAKE A ROOM</h3>
        <div className="grid grid-cols-1 gap-2">
          {levels.map((lvl) => {
            const locked = lvl.proOnly && !canHostPremium;
            return (
              <button
                key={lvl.id}
                onClick={() => !locked && handleHost(lvl.id)}
                disabled={isLoad || locked}
                className={`py-3 px-3 border-2 border-slate-900 rounded-xl font-bold text-sm text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  locked ? 'bg-gray-100' : 'hover:bg-indigo-50'
                }`}
              >
                <span className="block">{isLoad ? '...' : lvl.id}</span>
                <span className="block text-[10px] text-slate-500 font-bold">
                  {lvl.label} · +{lvl.points} pts {locked ? '· 🔒 PRO HOST' : ''}
                </span>
              </button>
            );
          })}
        </div>
        {!canHostPremium && (
          <p className="text-xs text-slate-500 mt-2 font-bold">
            Junior & Senior hosting requires{' '}
            <Link href="/subscription" className="text-indigo-600 underline">
              Pro Plan
            </Link>
          </p>
        )}
      </div>

      <div className="relative border-t border-gray-100 py-2">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] text-gray-300 font-bold">
          OR
        </span>
      </div>

      <div>
        <h3 className="text-slate-900 font-black mb-3">JOIN A ROOM</h3>
        <input
          type="text"
          maxLength={8}
          placeholder="CODE"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          className="w-full p-4 border-2 border-slate-900 rounded-2xl text-center font-mono text-xl mb-3"
        />
        <button
          onClick={handleJoin}
          disabled={joinCode.length !== 8 || isJoinLoad}
          className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl disabled:bg-gray-200 disabled:opacity-60"
        >
          {isJoinLoad ? 'JOINING...' : 'JOIN GAME'}
        </button>
      </div>
    </div>
  );
}
