'use client';

interface SettingActionsProps{
    onOpen: ()=> void;
}

export default function SettingActions({onOpen}: SettingActionsProps){

    return (
        <div>
            <button 
                onClick={onOpen}
                className ="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all group w-full"
                >
                <span className="text-indigo-400 group-hover:scale-110 transition-transform">⚙️</span>
                SETTING
            </button>
        </div>
    )
}