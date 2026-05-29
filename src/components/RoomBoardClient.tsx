'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import JengaTower3D from '@/components/JengaTower3D';
import PlayerScoreBar from '@/components/PlayerScoreBar';
import QrScannerModal from '@/components/QrScannerModal';
import GameOverModal from '@/components/GameOverModal';
import { useRoomPolling } from '@/hooks/useRoomPolling';
import type { PlayerStanding } from '@/lib/multiplayer-scoring';

type Participant = {
  id: string;
  userId: string;
  totalScore: number;
  isEliminated: boolean;
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
};

type RoomData = {
  joinCode: string;
  status: string;
  level: string;
  currentTurnUserId?: string | null;
  participants: Participant[];
  ownerId: string;
  standings?: PlayerStanding[];
  turnPlayer?: { id: string; name: string | null } | null;
};

type RoomBoardClientProps = {
  roomCode: string;
  initialRoom: RoomData;
  isHost: boolean;
  currentUserId: string;
};

const LEVEL_LABELS: Record<string, { label: string; points: number; color: string }> = {
  ENTRY: { label: 'Easy', points: 200, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  JUNIOR: { label: 'Medium', points: 300, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  SENIOR: { label: 'Hard', points: 400, color: 'text-rose-600 bg-rose-50 border-rose-200' },
};

export default function RoomBoardClient({
  roomCode,
  initialRoom,
  isHost,
  currentUserId,
}: RoomBoardClientProps) {
  const router = useRouter();
  const [room, setRoom] = useState<RoomData>(initialRoom);
  const [standings, setStandings] = useState<PlayerStanding[]>(initialRoom.standings ?? []);
  const [error, setError] = useState<string | null>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const refreshRef = useRef<() => void>(() => undefined);

  const isFinished = room.status === 'FINISHED';
  const me = room.participants.find((p) => p.userId === currentUserId);
  const isEliminated = me?.isEliminated ?? false;
  const isMyTurn = !isFinished && room.currentTurnUserId === currentUserId && !isEliminated;
  const turnPlayerName =
    room.turnPlayer?.name?.split(' ')[0] ??
    room.participants.find((p) => p.userId === room.currentTurnUserId)?.user.name?.split(' ')[0] ??
    'Someone';
  const levelInfo = LEVEL_LABELS[room.level] ?? LEVEL_LABELS.ENTRY;

  const statusText = isFinished
    ? 'Game finished'
    : isMyTurn
      ? '🎯 Your move — pull a block!'
      : isEliminated
        ? 'You broke the tower'
        : `Waiting for ${turnPlayerName}'s turn`;

  useEffect(() => {
    sessionStorage.setItem('activeRoomCode', roomCode);
  }, [roomCode]);

  useRoomPolling<RoomData>({
    roomCode,
    intervalMs: 2500,
    onData: (data) => {
      setRoom(data);
      setStandings(data.standings ?? []);
      setError(null);

      if (data.status === 'WAITING') {
        router.replace(`/play/multi/${roomCode}`);
      }
    },
    onError: (status) => {
      if (status === 404) {
        alert('The room was closed by the host.');
        router.replace('/');
        return;
      }
      setError('Unable to refresh room status.');
    },
  });

  refreshRef.current = () => {
    fetch(`/api/rooms/${roomCode}`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data) return;
        setRoom(data);
        setStandings(data.standings ?? []);
      })
      .catch(() => undefined);
  };

  const handleScan = (blockId: string) => {
    if (!isMyTurn) return;
    setScanOpen(false);
    router.push(`/play/multi/${roomCode}/quiz/${blockId}`);
  };

  const handleBreakTower = () => {
    if (!isMyTurn || breaking) return;

    const confirmed = window.confirm(
      'Break the tower? The game will end and you will be ranked last.'
    );
    if (!confirmed) return;

    setBreaking(true);
    fetch(`/api/rooms/${roomCode}/break-tower`, { method: 'POST' })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setRoom((prev) => ({ ...prev, status: 'FINISHED', currentTurnUserId: null }));
          if (data.standings) setStandings(data.standings);
          else refreshRef.current();
          return;
        }
        setError(typeof data.error === 'string' ? data.error : 'Could not break tower.');
      })
      .catch(() => setError('Could not break tower.'))
      .finally(() => setBreaking(false));
  };

  const handleReturnHome = () => {
    sessionStorage.removeItem('activeRoomCode');
    router.replace('/');
  };

  const handleCloseRoom = () => {
    const confirmClose = window.confirm('Close this room for everyone and leave?');
    if (!confirmClose) return;

    fetch(`/api/rooms/${roomCode}/close`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          sessionStorage.removeItem('activeRoomCode');
          router.replace('/');
          return;
        }
        setError('Failed to close room.');
      })
      .catch(() => setError('Failed to close room.'));
  };

  return (
    <div className="h-dvh flex flex-col bg-white text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />

      {/* Header */}
      <header className="relative z-20 shrink-0 bg-white/95 backdrop-blur border-b-2 border-slate-900 px-3 pt-3 pb-2">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl shrink-0">🏗️</span>
              <div className="min-w-0">
                <h1 className="text-sm font-black leading-tight truncate">Jenga Board</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full border ${levelInfo.color}`}
                  >
                    {levelInfo.label} +{levelInfo.points}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{room.joinCode}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isHost && !isFinished && (
                <button
                  type="button"
                  onClick={handleCloseRoom}
                  className="text-[9px] font-black uppercase text-slate-400 hover:text-red-500 px-2 py-1"
                >
                  Close
                </button>
              )}
              {isFinished ? (
                <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200 px-2 py-1 rounded-lg">
                  Done
                </span>
              ) : isMyTurn ? (
                <span className="text-[9px] font-black uppercase bg-amber-400 text-white px-2 py-1 rounded-lg animate-pulse">
                  Your Turn
                </span>
              ) : isEliminated ? (
                <span className="text-[9px] font-black uppercase bg-red-100 text-red-600 px-2 py-1 rounded-lg">
                  Out
                </span>
              ) : null}
            </div>
          </div>

          <PlayerScoreBar
            standings={standings}
            currentUserId={currentUserId}
            currentTurnUserId={isFinished ? null : room.currentTurnUserId}
          />
        </div>
      </header>

      {/* Status strip */}
      {!isFinished && (
        <div
          className={`relative z-20 shrink-0 mx-3 mt-2 px-4 py-2 rounded-xl border-2 text-center text-xs font-bold ${
            isMyTurn
              ? 'border-amber-400 bg-amber-50 text-amber-800'
              : 'border-slate-200 bg-white/90 text-slate-600'
          }`}
        >
          {statusText}
        </div>
      )}

      {/* Tower — fills all remaining space */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-lg mx-auto px-3 py-2">
        <JengaTower3D />
      </main>

      {/* Action dock */}
      {!isFinished && isMyTurn && (
        <div className="relative z-20 shrink-0 px-3 pb-4 pt-1 max-w-lg mx-auto w-full">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setScanOpen(true)}
              className="flex-1 py-3.5 bg-indigo-600 text-white font-black text-sm rounded-xl border-[3px] border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-none active:translate-y-0.5 transition-all"
            >
              📷 Scan QR
            </button>
            <button
              type="button"
              onClick={handleBreakTower}
              disabled={breaking}
              className="flex-1 py-3.5 bg-rose-500 text-white font-black text-sm rounded-xl border-[3px] border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-none active:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {breaking ? '…' : '💥 Break Tower'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="relative z-20 shrink-0 mx-3 mb-3 text-red-700 font-bold text-xs bg-red-50 px-3 py-2 rounded-xl border-2 border-red-200 text-center">
          {error}
        </div>
      )}

      <QrScannerModal
        isOpen={scanOpen && isMyTurn}
        onClose={() => setScanOpen(false)}
        onScan={handleScan}
      />

      {isFinished && (
        <GameOverModal
          standings={standings}
          currentUserId={currentUserId}
          onReturnHome={handleReturnHome}
        />
      )}
    </div>
  );
}
