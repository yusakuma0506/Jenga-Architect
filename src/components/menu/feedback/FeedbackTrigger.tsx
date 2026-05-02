'use client';
import Link from 'next/link';
import { useState } from 'react';

interface SettingActionsProps{
    onOpen: ()=> void;
    isAdmin: boolean;
}

export default function FeedbackTrigger({isAdmin , onOpen} :SettingActionsProps){
    const [isLoad, setIsLoad] = useState(false);

    if(isAdmin){
        return(
            <Link 
                href = "/feedback" 
                onClick={() => setIsLoad(true)}
                aria-disabled={isLoad}
                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all group w-full aria-disabled:pointer-events-none aria-disabled:opacity-60"
            >
                <span className="text-indigo-400 group-hover:scale-110 transition-transform">💬</span>
                {isLoad ? 'LOADING...' : 'FEEDBACK'}
                
            </Link>
        );
    }

    return(
        <div>
            <button 
                onClick={onOpen}
                disabled={isLoad}
                className ="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all group w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                <span className="text-indigo-400 group-hover:scale-110 transition-transform">💬</span>
                FEEDBACK
            </button>
        </div>
    );
    
}
