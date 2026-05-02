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
  currentPlayers = 0
}: StartGameButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const canStart = currentPlayers >= minPlayers;

  const handleStart = async () => {
    if (!canStart) return;
    
    setLoading(true);
    const res = await fetch(`/api/rooms/${roomCode}/start`, { method: 'PATCH' });
    if (res.ok) {
      router.push(`/play/multi/${roomCode}/board`);
    } else {
      setLoading(false);
      alert("Failed to start game.");
    }
  };

  return (
    <button 
      onClick={handleStart}
      disabled={loading || !canStart}
      className="w-full py-5 bg-indigo-600 text-white font-black text-2xl rounded-2xl shadow-[8px_8px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-60"
    >
      {loading ? "SYNCING..." : canStart ? "START BUILD" : `NEED ${minPlayers - currentPlayers} MORE PLAYERS`}
    </button>
  );
}