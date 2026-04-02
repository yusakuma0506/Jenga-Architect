'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import {useRouter} from "next/navigation";

export default function SecretLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const isValid = email.trim().length > 0 && password.trim().length > 0

    const handleSecretLogin = async (e: React.FormEvent) => {
        if(!isValid) {return}
        setError("")

        e.preventDefault();
        const result = await signIn("credentials", { 
        email, 
        password, 
        redirect: false, 
        });

        if(result?.error){
            setError("Email or Password is Incorrect")
        }else{
            router.push('/');
            router.refresh()
        }

    };

    

    return (
        <div className="flex flex-col items-center justify-center h-svh bg-slate-900 text-blue-500 font-mono">
            <div className="border border-blue-500 p-8 rounded-lg shadow-[0_0_15px_rgba(30,7,90,0.5)]">
                <h1 className="text-2xl mb-6">Admin / Sample User</h1>
                <p className="text-red-400 text-sm mb-2">{error}</p>
                <form onSubmit={handleSecretLogin} className="flex flex-col gap-4">
                <input 
                    type="text" 
                    placeholder="Email" 
                    suppressHydrationWarning
                    className="bg-slate-900 rounded-md border border-blue-800 p-2 outline-none focus:border-blue-300"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="bg-slate-900 rounded-md border border-blue-800 p-2 outline-none focus:border-blue-300"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={`${isValid? " bg-blue-900 hover:bg-blue-700": "bg-gray-800"} rounded-md text-white p-2 transition`}
                    disabled={!isValid}
                >
                    LOGIN
                </button>
                </form>
            </div>
        </div>
    );
}