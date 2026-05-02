'use client'
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ScanRedirect() {
  const router = useRouter();
  const { blockId } = useParams();

  useEffect(() => {
    // Look for the active room stored during the 'Join/Host' step
    const roomCode = sessionStorage.getItem('activeRoomCode');

    if (!roomCode) {
      // If they scanned without being in a room, send them home.
      router.push('/');
      return;
    }

    // Send them to the specific quiz page inside their room
    router.push(`/play/multi/${roomCode}/quiz/${blockId}`);
  }, [blockId, router]);

  return <div className="h-screen flex items-center justify-center font-bold">Connecting Block to Session...</div>;
}
