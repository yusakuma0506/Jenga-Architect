
import {getServerSession} from "next-auth";
import {authOptions} from  "../../api/auth/[...nextauth]/route" 
import {prisma} from "../../../lib/prisma";
import Link from "next/link";
import Image from "next/image";


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
        <div className="sticky top-0 z-50 p-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200">
                <Link href="/" className="relative block p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <Image
                    src="/back_arrow.svg"
                    alt="back"
                    width={32} 
                    height={32}
                    />
                </Link>
                <h1 className="font-bold text-2xl">Multiplay</h1>
        </div>
        
      </main>

    );
  }
  return (

    <main className="h-svh bg-white text-slate-900 font-sans">
        <div className="fixed inset-0 opacity-40 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]"/>
        <div className="flex flex-col h-svh w-full justify-center items-center mx-auto">
          <h1>This page is for Logedin Users</h1>
        </div>
    </main>
    
  );

}
