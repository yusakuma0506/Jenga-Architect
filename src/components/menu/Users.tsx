'use client';
import { User } from "@prisma/client";

export default function Users ({allUsers}: {allUsers:User[]}){


    return(
        <div className="flex flex-col gap-2 mt-5 p-2 w-full min-h-screen" >
            {allUsers.map((user)=>(
                <div key={user.id} className="p-6 bg-white border rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-600">{user.email}</span>
                        <span className="text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>

                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-slate-800">{user.name}</p>
                        <span className={`text-xs font-bold ${user.isPro? "text-amber-700" :"text-slate-600"}`}>
                            {user.isPro ? "PRO":"FREE"}
                        </span>
                    </div>
    
                </div>


            ))}
                
        </div>
    );
}