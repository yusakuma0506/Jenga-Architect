'use client';
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center h-svh bg-white text-white">
    <div className="fixed inset-0 opacity-40 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="p-8 z-[1000] bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-4 text-center">Login to Jenga Architect</h2>
        <button 
          onClick={() => signIn("google", {callbackUrl: "/" })}
          className="bg-white text-black p-3 rounded font-bold w-64 flex items-center hover:bg-gray-300 active:scale-95"
        >
            <Image src="/google.png" alt="google icon" width={24} height ={24} className="mx-2 mr-4"/>
            Sign in with Google
          
        </button>
        <button 
          onClick={() => signIn("github", {callbackUrl: "/" })}
          className="bg-gray-500 text-white p-3 rounded font-bold w-64 flex items-center hover:bg-gray-600 active:scale-95"
        >
            <Image src="/github.png" alt="github icon" width={24} height ={24} className="mx-2 mr-4"/>

            Sign in with GitHub
        </button>
      </div>
    </div>
  );
}