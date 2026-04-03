'use client';
import Image from "next/image";
import HamburgerMenu from "./menu/HamburgerMenu";

interface NavProps{
    user: {
        id: string;
        name:string;
        image: string;
        isPro: boolean;
        role:string;
    }
    
}

export default function Nav ({user}: NavProps){
    const planLabel = user.isPro ? "Pro Plan": "Free Plan";

    const planStyles = user.isPro 
    ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm" 
    : "bg-slate-100 text-slate-600 border-slate-200 shadow-sm";
    return(
        <nav className="sticky top-0 z-50 p-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex gap-4 items-center">
            <div className="relative w-12 h-12 border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden p-0.5">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden">
                <Image src={user.image || "/default_photo.jpg"} alt="Profile" fill className="object-cover" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-slate-900 font-bold text-sm tracking-tight leading-tight">
                {user.name}
              </span>
              <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 border rounded-full w-fit ${planStyles}`}>
                {planLabel.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <HamburgerMenu user={user}/>
          </div>
        </nav>
    );
}