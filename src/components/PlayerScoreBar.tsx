'use client';

import Image from 'next/image';
import type { PlayerStanding } from '@/lib/multiplayer-scoring';

type PlayerScoreBarProps = {
  standings: PlayerStanding[];
  currentUserId?: string;
  currentTurnUserId?: string | null;
};

export default function PlayerScoreBar({
  standings,
  currentUserId,
  currentTurnUserId,
}: PlayerScoreBarProps) {
  return (
    <div className="w-full overflow-x-auto pb-0.5 scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {standings.map((player) => {
          const isMe = player.userId === currentUserId;
          const isTurn = player.userId === currentTurnUserId && !player.isEliminated;

          return (
            <div
              key={player.userId}
              className={`relative flex-shrink-0 w-[88px] rounded-xl border-2 px-2 py-2 text-center transition-all duration-300 ${
                player.isEliminated
                  ? 'border-red-200 bg-red-50 opacity-50 grayscale'
                  : isTurn
                    ? 'border-amber-400 bg-amber-50 shadow-[0_0_16px_rgba(251,191,36,0.35),4px_4px_0_0_#f59e0b] scale-105 z-10'
                    : isMe
                      ? 'border-indigo-300 bg-indigo-50 shadow-[3px_3px_0_0_#6366f1]'
                      : 'border-slate-900 bg-white shadow-[3px_3px_0_0_#0f172a]'
              }`}
            >
              {isTurn && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full">
                  TURN
                </span>
              )}
              <div className="relative w-9 h-9 mx-auto mb-1">
                <Image
                  src={player.image || '/default_photo.jpg'}
                  alt={player.name}
                  fill
                  className={`rounded-full border-2 object-cover ${
                    isTurn ? 'border-amber-500' : 'border-slate-900'
                  }`}
                />
              </div>
              <p className="text-[10px] font-black truncate">{player.name}</p>
              <p className="text-[8px] font-bold text-indigo-500 uppercase">{player.rankLabel}</p>
              <p
                className={`text-sm font-black tabular-nums leading-tight ${
                  player.totalScore < 0 ? 'text-red-600' : isTurn ? 'text-amber-600' : 'text-slate-900'
                }`}
              >
                {player.totalScore}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
