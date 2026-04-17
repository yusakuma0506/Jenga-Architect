'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StartGameButton({ roomCode }: { roomCode: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
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
      disabled={loading}
      className="mt-12 w-full max-w-xs py-5 bg-indigo-600 text-white font-black text-2xl rounded-2xl shadow-[8px_8px_0_0_#000] active:translate-y-1 active:shadow-none"
    >
      {loading ? "SYNCING..." : "START BUILD"}
    </button>
  );
}