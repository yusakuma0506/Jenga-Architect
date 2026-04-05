'use client';

import Link from "next/link";


export default function LobbyClient(){
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
          className="group text-center relative w-72 py-5 bg-green-400 border-[3px] border-slate-900 rounded-xl transition-all duration-75 active:translate-y-1 active:shadow-none shadow-[0_8px_0_0_#0f172a] hover:bg-green-300">
            <span className="text-4xl  font-black text-slate-900 uppercase tracking-tighter">
              👤 Solo
            </span>
          </Link>

          <Link
          href ="/play/multi"
          className="group text-center relative w-72 py-5 bg-orange-400 border-[3px] border-slate-900 rounded-xl transition-all duration-75 active:translate-y-1 active:shadow-none shadow-[0_8px_0_0_#0f172a] hover:bg-orange-200">
            <span className="text-4xl font-black text-slate-900 uppercase tracking-tighter text-slate-700">
              👥 Multi
            </span>
          </Link>
        </div>
    </div>
  );

}