'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type StartGameButtonProps = {
  roomCode: string;
  minPlayers?: number;
  currentPlayers?: number;
};

export default function StartGameButton({
  roomCode,
  minPlayers = 1,
  currentPlayers = 0,
}: StartGameButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canStart = currentPlayers >= minPlayers;

  const handleStart = async () => {
    if (!canStart || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/rooms/${roomCode}/start`, { method: 'PATCH' });
      const body = await res.json().catch(() => ({}));

      if (res.ok || body.alreadyStarted) {
        router.push(`/play/multi/${roomCode}/board`);
        return;
      }

      setError(typeof body.error === 'string' ? body.error : `Failed to start (${res.status}).`);
    } catch {
      setError('Network error — could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleStart}
        disabled={loading || !canStart}
        className="w-full py-5 bg-indigo-600 text-white font-black text-2xl rounded-2xl shadow-[8px_8px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {loading
          ? 'SYNCING...'
          : canStart
            ? 'START BUILD'
            : `NEED ${minPlayers - currentPlayers} MORE PLAYERS`}
      </button>

      {error && (
        <p className="text-red-600 text-sm font-bold text-center px-2">{error}</p>
      )}
    </div>
  );
}
