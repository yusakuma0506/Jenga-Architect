'use client';
import Link from 'next/link';

interface SettingActionsProps{
    onOpen: ()=> void;
    isAdmin: boolean;
}

export default function FeedbackTrigger({isAdmin , onOpen} :SettingActionsProps){
    if(isAdmin){
        return(
            <Link 
                href = "/admin?tab=feedback" 
                className="text-amber-500 hover:text-amber-300 text-xs uppercase transition-colors p-1 cursor-pointer"
            >
                {">"} View Report
            </Link>
        );
    }

    return(
        <div>
            <button 
                onClick={onOpen}
                className ="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all group w-full"
                >
                <span className="text-indigo-400 group-hover:scale-110 transition-transform">💬</span>
                Feedback
            </button>
        </div>
    );
    
}
