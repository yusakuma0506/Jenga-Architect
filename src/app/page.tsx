import {getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]/route"
import Image from "next/image";
import {prisma} from "../lib/prisma";
import Nav from "../components/Nav";
import Link from "next/link";
import LobbyClient from "@/components/LobbyClient";

export default async function Home(){
  const session = await getServerSession(authOptions);

  const dbUser = session?.user?.id 
    ? await prisma.user.findUnique ({
    where:{id: session.user.id},
    select: {id:true, email:true, image:true, name:true, isPro: true, role:true}
  }):null;


  if(session && dbUser ){
    return (
      <main className="h-svh bg-white text-slate-900 font-sans">
        <div className="fixed inset-0 opacity-40 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]"/>
        
        <Nav  user={dbUser} />
        <LobbyClient user={dbUser}/>

      </main>

    );
  }
  return (

    <main className="min-h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <div className="fixed inset-0 opacity-40 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]" />

      <nav className="stikey top-0 z-50 p-6 flex justify-between items-center max-w-full mx-auto bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-lg">J</span>
          <span className="text-slate-900">Jenga Architect</span>
        </div>
        <Link href="/api/auth/signin" className="px-6 py-2.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 transition-all active:scale-95">
          Login
        </Link>
      </nav>

      <div className="relative z-10 container mx-auto pt-20 px-6 text-center">

        <h1 className="text-6xl md:text-7xl max-[450px]:text-5xl font-black text-slate-900 tracking-tight leading-[0.9]">
          Build Python <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Architecture</span>
        </h1>
        <p className="mt-6 text-slate-500 max-w-lg mx-auto text-lg">
          Master <span className="font-bold text-slate-800">OOP principles</span> through structural logic. The interactive way to learn Python.
        </p>

        <div className="flex flex-wrap justify-center gap-10 mt-20">
          
          <div className="group w-full max-w-[360px] bg-white border border-slate-200 p-2 rounded-[32px] hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-slate-800">Solo Play</h2>
              </div>
              <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden shadow-inner">
                <Image src="/soloplay.jpg" alt="Solo" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-slate-500 text-left text-sm leading-relaxed">
                Construct code blocks to master <span className="text-blue-600 font-semibold">OOP</span> and learn <span className="text-blue-600 font-semibold">Solid Principle</span>
              </p>
            </div>
          </div>

          <div className="group w-full max-w-[360px] bg-white border border-slate-200 p-2 rounded-[32px] hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-slate-800">Multi Play</h2>
              </div>
              <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden shadow-inner">
                <Image src="/multiplay.jpg" alt="Multi" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-slate-500 text-left text-sm leading-relaxed">
                Real-time collaborate with others to build <span className="text-blue-600 font-semibold">Scalable Software</span> with Jenga.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="my-20">
          <Link href="/api/auth/signin" className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 transition-all">
            START BUILDING NOW
          </Link>
        </div>
      </div>
    </main>
    
  );

}
