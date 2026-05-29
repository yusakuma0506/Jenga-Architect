'use client';

import { useEffect, useRef } from 'react';

type UseRoomPollingOptions<T> = {
  roomCode: string;
  intervalMs?: number;
  enabled?: boolean;
  onData: (data: T) => void;
  onError?: (status: number) => void;
};

export function useRoomPolling<T>({
  roomCode,
  intervalMs = 2500,
  enabled = true,
  onData,
  onError,
}: UseRoomPollingOptions<T>) {
  const onDataRef = useRef(onData);
  const onErrorRef = useRef(onError);
  const fetchingRef = useRef(false);

  onDataRef.current = onData;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const fetchRoom = () => {
      if (fetchingRef.current || cancelled) return;
      fetchingRef.current = true;

      fetch(`/api/rooms/${roomCode}`, { cache: 'no-store' })
        .then((response) => {
          if (cancelled) return;
          if (!response.ok) {
            onErrorRef.current?.(response.status);
            return;
          }
          return response.json() as Promise<T>;
        })
        .then((data) => {
          if (!cancelled && data) {
            onDataRef.current(data);
          }
        })
        .catch(() => {
          if (!cancelled) onErrorRef.current?.(0);
        })
        .finally(() => {
          fetchingRef.current = false;
        });
    };

    fetchRoom();
    const timer = window.setInterval(fetchRoom, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [roomCode, intervalMs, enabled]);
}
