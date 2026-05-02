'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import StartGameButton from './ui/StartGameButton';

type Participant = {
  id: string;
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
};

type RoomData = {
  joinCode: string;
  status: string;
  participants: Participant[];
  ownerId: string;
  owner: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
};

type RoomLobbyClientProps = {
  roomCode: string;
  initialRoom: RoomData;
  isHost: boolean;
};

export default function RoomLobbyClient({ roomCode, initialRoom, isHost }: RoomLobbyClientProps) {
  const router = useRouter();
  const [room, setRoom] = useState<RoomData>(initialRoom);
  const [loading, setLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomCode}`, { cache: 'no-store' });

        if (response.status === 404) {
          alert('The room was closed by the host.');
          router.replace('/play/multi');
          return;
        }

        if (!response.ok) {
          setError('Unable to refresh room status.');
          return;
        }

        const data = await response.json();
        setRoom(data);

        // Check if owner has left (not in participants list anymore)
        const ownerStillInRoom = data.participants.some(
          (p: Participant) => p.user.id === data.ownerId
        );

        if (!ownerStillInRoom) {
          alert('The host has left the room.');
          router.replace('/play/multi');
          return;
        }
      } catch {
        setError('Unable to refresh room status.');
      }
    };

    fetchRoom();
    intervalRef.current = window.setInterval(fetchRoom, 3000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [roomCode, router]);

  useEffect(() => {
    if (!isHost) return;

    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [isHost]);

  const handleCloseRoom = async () => {
    const confirmClose = window.confirm('Close this room for everyone and leave?');
    if (!confirmClose) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomCode}/close`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setError('Failed to close room.');
        setLoading(false);
        return;
      }

      router.replace('/play/multi');
    } catch {
      setError('Failed to close room.');
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    const confirmLeave = window.confirm('Leave this room?');
    if (!confirmLeave) return;

    setLeaveLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomCode}/leave`, {
        method: 'POST',
      });

      if (!response.ok) {
        setError('Failed to leave room.');
        setLeaveLoading(false);
        return;
      }

      router.replace('/play/multi');
    } catch {
      setError('Failed to leave room.');
      setLeaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="mt-12 text-center">
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Join Code</p>
        <h1 className="text-6xl font-black border-4 border-slate-900 px-6 py-2 rounded-2xl shadow-[6px_6px_0_0_#000] mb-10">
          {room.joinCode}
        </h1>
      </div>

      <div className="w-full max-w-sm bg-slate-50 border-4 border-slate-900 rounded-[40px] p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-lg">PLAYERS</h2>
          <span className="font-black bg-slate-900 text-white px-3 py-1 rounded-full text-sm">
            {room.participants.length} / 6
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {room.participants.map((p) => (
            <div key={p.id} className="flex flex-col items-center">
              <Image
                src={p.user.image || '/default_photo.jpg'}
                alt={p.user.name ?? 'Player'}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full border-4 border-slate-900 object-cover"
              />
              <p className="text-[10px] font-black mt-1 truncate w-16 text-center">
                {p.user.name?.split(' ')[0] ?? 'PLAYER'}
              </p>
            </div>
          ))}
          {Array.from({ length: 6 - room.participants.length }).map((_, i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-full border-4 border-dashed border-slate-200"
            />
          ))}
        </div>
      </div>

      {error ? (
        <div className="max-w-sm text-red-600 font-bold mb-4">{error}</div>
      ) : (
        <div className="max-w-sm text-sm text-slate-500 mb-4">Auto-refreshing room status every 3 seconds.</div>
      )}

      {isHost && (
        <div className="w-full max-w-xs space-y-4">
          <StartGameButton roomCode={room.joinCode} minPlayers={3} currentPlayers={room.participants.length} />
          <button
            onClick={handleCloseRoom}
            disabled={loading}
            className="w-full py-5 bg-red-600 text-white font-black text-2xl rounded-2xl shadow-[8px_8px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-60"
          >
            {loading ? 'CLOSING...' : 'CLOSE ROOM'}
          </button>
          <p className="text-center text-slate-500 text-xs">
            If the room is closed, all players will be returned to the lobby.
          </p>
        </div>
      )}

      {!isHost && (
        <button
          onClick={handleLeaveRoom}
          disabled={leaveLoading}
          className="mt-12 w-full max-w-xs py-5 bg-slate-600 text-white font-black text-2xl rounded-2xl shadow-[8px_8px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-60"
        >
          {leaveLoading ? 'LEAVING...' : 'LEAVE ROOM'}
        </button>
      )}
    </div>
  );
}
