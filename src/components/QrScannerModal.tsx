'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

type QrScannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onScan: (blockId: string) => void;
};

function extractBlockId(text: string): string | null {
  const match = text.match(/BLOCK-\d{2}/i);
  return match ? match[0].toUpperCase() : null;
}

export default function QrScannerModal({ isOpen, onClose, onScan }: QrScannerModalProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  onScanRef.current = onScan;

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    let isRunning = false;
    const scannerId = 'jenga-qr-reader';
    const scanner = new Html5Qrcode(scannerId);
    scannerRef.current = scanner;

    const stopScanner = (): Promise<void> => {
      if (!isRunning) return Promise.resolve();
      isRunning = false;
      return scanner.stop().catch(() => undefined);
    };

    setStarting(true);
    setError(null);

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          const blockId = extractBlockId(decodedText);
          if (!blockId || !mounted) return;

          stopScanner().then(() => {
            if (mounted) onScanRef.current(blockId);
          });
        },
        () => undefined
      )
      .then(() => {
        isRunning = true;
        if (!mounted) {
          return stopScanner();
        }
        setStarting(false);
      })
      .catch(() => {
        if (mounted) {
          setError('Camera unavailable. Enter block code manually.');
          setStarting(false);
        }
      });

    return () => {
      mounted = false;
      void stopScanner();
      scannerRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setManualCode('');
      setError(null);
      setStarting(false);
    }
  }, [isOpen]);

  const handleManualSubmit = () => {
    const code = manualCode.trim().toUpperCase();
    if (/^BLOCK-\d{2}$/.test(code)) {
      onScan(code);
    } else {
      setError('Use format BLOCK-01');
    }
  };

  return (
    <div
      className={
        isOpen
          ? 'fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4'
          : 'hidden'
      }
      aria-hidden={!isOpen}
    >
      <div className="bg-white border-4 border-slate-900 rounded-3xl p-5 w-full max-w-sm shadow-[8px_8px_0_0_#000]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-black text-lg">Scan Block QR</h2>
          <button onClick={onClose} type="button" className="font-black text-xl px-2">
            ✕
          </button>
        </div>

        <div
          id="jenga-qr-reader"
          className="w-full overflow-hidden rounded-xl border-2 border-slate-200 min-h-[220px] bg-slate-100"
        />

        {starting && (
          <p className="text-center text-xs font-bold text-slate-500 mt-2">Starting camera...</p>
        )}
        {error && <p className="text-center text-xs font-bold text-amber-700 mt-2">{error}</p>}

        <div className="mt-4 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            Or enter manually
          </p>
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            placeholder="BLOCK-01"
            maxLength={8}
            className="w-full p-3 border-2 border-slate-900 rounded-xl text-center font-mono font-black"
          />
          <button
            onClick={handleManualSubmit}
            type="button"
            className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl"
          >
            GO TO QUIZ
          </button>
        </div>
      </div>
    </div>
  );
}
