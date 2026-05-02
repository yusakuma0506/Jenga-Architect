'use client';

import Link from "next/link";
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import MultiplaySelector from '@/components/MultiplaySelector';


export default function LobbyClient(){
  const [isMultiOpen, setIsMultiOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  return (
    <div>
      <div className="relative z-10 container mt-10 mx-auto py-16 px-6 max-w-4xl text-center">
          <h1 className="text-6xl md:text-7xl max-[450px]:text-5xl font-black text-slate-900 tracking-tight leading-[0.9]">
            Learn Python <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Jenga Architect
            </span>
          </h1>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 mt-15">
          <Link
          href = "/play/solo"
          onClick={() => setIsLoad(true)}
          className="group text-center relative w-72 py-5 bg-green-400 border-[3px] border-slate-900 rounded-xl transition-all duration-75 active:translate-y-1 active:shadow-none shadow-[0_8px_0_0_#0f172a] hover:bg-green-300 aria-disabled:pointer-events-none aria-disabled:opacity-60"
          aria-disabled={isLoad}
          >
            <span className="text-4xl  font-black text-slate-900 uppercase tracking-tighter">
              {isLoad ? 'LOADING...' : '👤 Solo'}
            </span>
          </Link>

          <button 
          className="group text-center relative w-72 py-5 bg-orange-400 border-[3px] border-slate-900 rounded-xl transition-all duration-75 active:translate-y-1 active:shadow-none shadow-[0_8px_0_0_#0f172a] hover:bg-orange-200 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoad}
          onClick={() => setIsMultiOpen(true)}>
            <span className="text-4xl font-black text-slate-900 uppercase tracking-tighter text-slate-700">
                👥 Multi
            </span>
          </button>
          
        </div>


        <Modal 
          isOpen={isMultiOpen} 
          onClose={() => setIsMultiOpen(false)} 
          title="MULTIPLAYER"
        >
          <MultiplaySelector />
        </Modal>
    </div>
  );

}
