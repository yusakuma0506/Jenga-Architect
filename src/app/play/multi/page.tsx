'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MultiplayPortal() {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const [isJoinLoad, setIsJoinLoad] = useState(false);

    // 1. HOST LOGIC: Create a room and redirect
    const handleHost = async (level: string) => {
        setIsLoad(true);
        try {
            const res = await fetch('/api/rooms/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level })
            });
            const data = await res.json();
            
            // Save room code so the scanner knows which room we belong to
            sessionStorage.setItem('activeRoomCode', data.joinCode);
            router.push(`/play/multi/${data.joinCode}`);
        } catch (error) {
            console.error("Host error:", error);
            setIsLoad(false);
        }
    };

    // 2. JOIN LOGIC: Join existing room
    const handleJoin = () => {
        if (joinCode.length === 6) {
            setIsJoinLoad(true);
            const code = joinCode.toUpperCase();
            sessionStorage.setItem('activeRoomCode', code);
            router.push(`/play/multi/${code}`);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border-[4px] border-slate-900 rounded-[40px] p-8 shadow-[12px_12px_0_0_#0f172a]">
                
                {/* --- HOST SECTION --- */}
                <section className="mb-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <span>🏗️</span> HOST A ROOM
                    </h2>
                    <p className="text-slate-500 text-sm mb-4">Pick a level to start a new Jenga session.</p>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {['ENTRY', 'JUNIOR', 'SENIOR'].map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => handleHost(lvl)}
                                disabled={isLoad || isJoinLoad}
                                className="py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoad ? 'LOADING...' : lvl}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="border-t-2 border-dashed border-slate-200 mb-10 relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 font-black text-slate-300">OR</span>
                </div>

                {/* --- JOIN SECTION --- */}
                <section>
                    <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <span>🔑</span> JOIN A ROOM
                    </h2>
                    <input 
                        type="text"
                        placeholder="ENTER 6-DIGIT CODE"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="w-full p-4 mb-4 border-4 border-slate-900 rounded-2xl text-center font-mono text-2xl font-black tracking-widest focus:outline-none focus:ring-4 ring-blue-500/20"
                    />
                    <button 
                        onClick={handleJoin}
                        disabled={joinCode.length !== 6 || isJoinLoad || isLoad}
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-[4px_4px_0_0_#3b82f6] hover:bg-slate-800 active:translate-y-1 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        {isJoinLoad ? 'JOINING...' : 'JOIN GAME'}
                    </button>
                </section>
            </div>
        </main>
    );
}
