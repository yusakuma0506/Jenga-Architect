'use client'
import {useRouter} from "next/navigation";
import {useState} from "react";

interface User{
    name: string;
    id: string; 
    email: string; 
    image: string; 
    isPro: boolean; 
}

export default function LevelGrid({}: {user:User}){
    const router = useRouter();
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [questionCount, setQuestionCount] = useState<number>(10);
    const [isLoad, setIsLoad] = useState(false);

    const levels = [
    { 
        id: 'ENTRY', 
        title: 'Capsule', 
        desc: 'Basic Python Class & Encapsulation & Inheritance.',
        blocks: '1-108', 
        difficulty: 'text-green-500',
        icon: '💊',
        isPro: false
    },
    { 
        id: 'JUNIOR', 
        title: 'Contract', 
        desc: 'Intermediate Classes & Polymorphism & Abstraction.',
        blocks: '1-108', 
        difficulty: 'text-orange-500',
        icon: '🏗️',
        isPro: true
    },
    { 
        id: 'SENIOR', 
        title: 'Resilience', 
        desc: 'Mastering SOLID Principles and Design Patterns.',
        blocks: '1-108', 
        difficulty: 'text-rose-500',
        icon: '🛡️',
        isPro: true
    },
    ];

    const handleStartBuild = () => {
        if (selectedLevel) {
            setIsLoad(true);
            router.push(`/play/solo/${selectedLevel.toLowerCase()}?limit=${questionCount}`);
        }
    };

    return (
        <div>
            <div className="max-w-4xl px-2 mx-auto mb-5 text-center mt-3">
                <h1 className="text-4xl z-10 font-black text-slate-900 tracking-tight">Select Your Project</h1>
                <p className="text-slate-500 mt-4 text-lg">Choose a structural level to begin building your Python knowledge.</p>
            </div>

            <div className="max-w-5xl p-6 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {levels.map((level) => {
                    // const isLocked = (level.id === "SENIOR" || level.id === "JUNIOR") && !user.isPro;

                    return (
                        <div key={level.id} className="group relative">
                            <div className="relative z-10 h-full bg-white border-[3px] border-slate-900 rounded-[32px] p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:-translate-x-1 shadow-[8px_8px_0_0_#0f172a]">
                                <div className="flex flex-row justify-between items-center">
                                    <div className="text-4xl mb-6">{level.icon}</div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">{level.title}</h3>
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">{level.desc}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className={`font-black text-xs uppercase tracking-widest ${level.difficulty}`}>{level.id}</span>
                                    <span className="text-slate-400 text-xs font-mono">Blocks {level.blocks}</span>
                                </div>

                                {/* <button
                                    onClick={() => !isLocked && setSelectedLevel(level.id)}
                                    className={`block w-full text-center mt-8 py-4 text-white font-black rounded-2xl transition-all    
                                        ${isLocked ? "bg-gray-400 cursor-not-allowed" : "bg-slate-900 hover:bg-blue-600 active:scale-95"}`}
                                >
                                    {isLocked ? "🔒 PRO ONLY" : "🔓 START BUILD"}
                                </button> */}
                                <button
                                    onClick={() => setSelectedLevel(level.id)}
                                    className="block w-full text-center mt-8 py-4 text-white font-black rounded-2xl transition-all    
                                         bg-slate-900 hover:bg-blue-600 active:scale-95"
                                >
                                     🔓 START BUILD
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- CONFIGURATION MODAL --- */}
            {selectedLevel && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white border-[4px] border-slate-900 p-8 rounded-[40px] max-w-sm w-full shadow-[12px_12px_0_0_#0f172a] animate-in zoom-in duration-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-2">QUANTITY</h2>
                        <p className="text-slate-500 text-sm mb-6">How many blocks do you want to stack for this session?</p>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[10, 20, 40, 60, 80, 108].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setQuestionCount(num)}
                                    className={`py-4 rounded-2xl font-black border-2 transition-all ${
                                        questionCount === num 
                                        ? "bg-blue-600 border-blue-600 text-white shadow-[4px_4px_0_0_#0f172a]" 
                                        : "border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900"
                                    }`}
                                >
                                    {num === 108 ? "ALL" : num}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleStartBuild}
                                disabled={isLoad}
                                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-green-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoad ? 'LOADING...' : 'START SOLVING'}
                            </button>
                            <button
                                onClick={() => setSelectedLevel(null)}
                                disabled={isLoad}
                                className="w-full py-2 text-slate-400 font-bold hover:text-slate-900 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}