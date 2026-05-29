'use client';

import Image from 'next/image';
import type { PlayerStanding } from '@/lib/multiplayer-scoring';

type GameOverModalProps = {
  standings: PlayerStanding[];
  currentUserId: string;
  onReturnHome: () => void;
};

export default function GameOverModal({
  standings,
  currentUserId,
  onReturnHome,
}: GameOverModalProps) {
  const loser = standings.find((p) => p.isEliminated);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white border-4 border-slate-900 rounded-3xl w-full max-w-md shadow-[10px_10px_0_0_#000] overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-200">Game Over</p>
          <h2 className="text-2xl font-black text-white mt-1">Final Rankings</h2>
          {loser && (
            <p className="text-sm font-bold text-indigo-100 mt-2">
              💥 {loser.name} broke the tower
            </p>
          )}
        </div>

        <div className="px-5 py-4 max-h-[50vh] overflow-y-auto space-y-2">
          {standings.map((player) => {
            const isMe = player.userId === currentUserId;
            return (
              <div
                key={player.userId}
                className={`flex items-center gap-3 rounded-2xl border-[3px] px-4 py-3 ${
                  player.isEliminated
                    ? 'border-red-200 bg-red-50'
                    : isMe
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-slate-200 bg-slate-50'
                }`}
              >
                <span className="text-lg font-black w-10 text-center text-slate-500">
                  {player.rankLabel}
                </span>
                <Image
                  src={player.image || '/default_photo.jpg'}
                  alt={player.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate">
                    {player.name}
                    {isMe && (
                      <span className="text-indigo-500 font-bold text-xs ml-1">(You)</span>
                    )}
                  </p>
                  {player.isEliminated && (
                    <p className="text-[10px] font-bold text-red-500 uppercase">Loser</p>
                  )}
                </div>
                <p className="font-black text-lg tabular-nums">{player.totalScore}</p>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={onReturnHome}
            className="w-full py-4 bg-slate-900 text-white font-black text-lg rounded-2xl border-[3px] border-slate-900 shadow-[5px_5px_0_0_#6366f1] hover:shadow-[2px_2px_0_0_#6366f1] active:shadow-none active:translate-y-0.5 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
