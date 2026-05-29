'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

/** Legacy QR URL redirect: /multi/scan/BLOCK-XX → /play/multi/scan/BLOCK-XX */
export default function LegacyScanRedirect() {
  const router = useRouter();
  const { blockId } = useParams();

  useEffect(() => {
    if (typeof blockId === 'string') {
      router.replace(`/play/multi/scan/${blockId}`);
    }
  }, [blockId, router]);

  return (
    <div className="h-screen flex items-center justify-center font-bold">
      Redirecting...
    </div>
  );
}
