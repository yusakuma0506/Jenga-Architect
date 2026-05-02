'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MultiplaySelector() {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState('');
    const [isLoad, setIsLoad] = useState(false);
    const [isJoinLoad, setIsJoinLoad] = useState(false);

    const handleHost = async (level: string) => {
        setIsLoad(true);
        const res = await fetch('/api/rooms/create', {
        method: 'POST',
        body: JSON.stringify({ level }),
        });
        const data = await res.json();
        sessionStorage.setItem('activeRoomCode', data.joinCode);
        router.push(`/play/multi/${data.joinCode}`);
    };

    const handleJoin = async () => {
        if (joinCode.length === 6) {
            setIsJoinLoad(true);
            const res = await fetch('/api/rooms/join', {
                method: 'POST',
                body: JSON.stringify({ joinCode: joinCode.toUpperCase() })
            });
            
            if (res.ok) {
                sessionStorage.setItem('activeRoomCode', joinCode.toUpperCase());
                router.push(`/play/multi/${joinCode.toUpperCase()}`);
            } else {
                alert("Room not found!");
                setIsJoinLoad(false);
            }
        }
    };

    return (
        <div className="space-y-8">
        {/* HOST SECTION */}
            <div>
                <h3 className="text-slate-900 font-black mb-3">MAKE A ROOM</h3>
                <div className="grid grid-cols-3 gap-2">
                {['ENTRY', 'JUNIOR', 'SENIOR'].map((lvl) => (
                    <button
                    key={lvl}
                    onClick={() => handleHost(lvl)}
                    disabled={isLoad}
                    className="py-3 px-1 border-2 border-slate-900 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {isLoad ? '...' : lvl}
                    </button>
                ))}
                </div>
            </div>

            <div className="relative border-t border-gray-100 py-2">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] text-gray-300 font-bold">OR</span>
            </div>

            {/* JOIN SECTION */}
            <div>
                <h3 className="text-slate-900 font-black mb-3">JOIN A ROOM</h3>
                <input
                type="text"
                maxLength={6}
                placeholder="CODE"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="w-full p-4 border-2 border-slate-900 rounded-2xl text-center font-mono text-xl mb-3"
                />
                <button
                onClick={handleJoin}
                disabled={joinCode.length !== 6 || isJoinLoad}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl disabled:bg-gray-200 disabled:opacity-60"
                >
                {isJoinLoad ? 'JOINING...' : 'JOIN GAME'}
                </button>
            </div>
        </div>
    );
}