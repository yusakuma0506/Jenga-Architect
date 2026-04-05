import Nav from "@/components/Nav";
import { getServerSession } from "next-auth";
import  {authOptions} from "../api/auth/[...nextauth]/route";
import {prisma} from "../../lib/prisma";
import Users from "@/components/menu/Users";



export default async function UsersCheck() {
  const session = await getServerSession(authOptions);
  
  const dbUser = session?.user?.id 
    ? await prisma.user.findUnique ({
    where:{id: session.user.id},
    select: {id:true, email:true, image:true, name:true, isPro: true, role:true}
  }):null;

  const allUsers = await prisma.user.findMany()

  if(session && dbUser.role ==="ADMIN" ){
    return (
      <div className="font-sans">
        <Nav user ={dbUser} />
        <Users allUsers = {allUsers}/>
        
      </div>
    );
  }

  return(
    <main className="h-svh bg-white text-slate-900 font-sans">
        <div className="fixed inset-0 opacity-40 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]"/>
        <div className="flex flex-col h-svh w-full justify-center items-center mx-auto">
          <h1>This page is for Admin</h1>
        </div>
    </main>
  )
}