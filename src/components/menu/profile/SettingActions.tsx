'use client';
import { useState } from 'react';

interface SettingActionsProps{
    onOpen: ()=> void;
}

export default function SettingActions({onOpen}: SettingActionsProps){
    const [isLoad, setIsLoad] = useState(false);

    return (
        <div>
            <button 
                onClick={() => {
                    setIsLoad(true);
                    onOpen();
                    setIsLoad(false);
                }}
                disabled={isLoad}
                className ="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all group w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                <span className="text-indigo-400 group-hover:scale-110 transition-transform">⚙️</span>
                {isLoad ? 'LOADING...' : 'SETTING'}
            </button>
        </div>
    )
}
