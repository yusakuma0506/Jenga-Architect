'use client';
import {useState, useRef} from 'react';
import { updateUsername } from '@/actions/profile';
import Image from "next/image";
import { updatePhoto } from '@/actions/profile';
import DeleteButton from './delete/DeleteButton';
import { useSession } from "next-auth/react";
import {useRouter} from 'next/navigation';
import {uploadToCloud} from "@/actions/upload";

interface User{
    id:string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role:string;
    isPro : boolean;
};


export default function ProfileForm({user}: {user:User}){
    const {update} = useSession();
    const router = useRouter();

    const [name, setName] = useState(user.name || "")
    const [isLoad, setIsLoad] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [img, setImg] = useState(user.image  || "/default_photo.jpg")
    const handleImageClick = () =>{
        fileInputRef.current?.click();
    }

    const handleFileChange = async (e:React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];
        if(file){
            setImg(URL.createObjectURL(file));

            const formData = new FormData();
            formData.append('file', file);

            const permanentUrl = await uploadToCloud(formData)
            const result = await updatePhoto(user.id, permanentUrl);
            if (result.success) {
                await update({
                    ...user,
                    image:permanentUrl,
                });
                router.refresh();
                alert("Change Image");
            }
        }
    }

    const handleNameSubmit= async(e: React.FormEvent) =>{
        e.preventDefault();
        setIsLoad(true);
        const result = await updateUsername(user.id, name)
        if(result.success){
            await update({
                ...user,
                name: name,
            })
            router.refresh();
            alert("Change Name")
        }
        setIsLoad(false);
    };

    const validation = name.trim().length<1 || name.length > 20;


    return(
        <div className='flex flex-col gap-8 font-sans text-lg'>
            <div className="flex flex-col items-center gap-2">
                <div 
                    onClick={handleImageClick}
                    className="rounded-xl shadow-sm p-0.5 relative w-20 h-20  border-2 border-blue-300 overflow-hidden cursor-pointer hover:border-blue-400 transition-all group bg-white"
                >
                    <Image
                    src={img} 
                    alt="Profile" 
                    fill
                    className="w-full h-full object-cover group-hover:opacity-50 "
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[8px] text-black bg-black/40">
                    Change Image
                    </div>
                </div>

                {/* Hidden Input */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                />
                </div>
  
            {user.role=== "ADMIN"
            ? <div className="flex flex-col gap-2">
                <label className="text-gray-800">Display Name:</label>
                <h1
                    className=" text-black border p-2 outline-none"
                >
                {name}
                </h1>
            </div>
            
            
            :<form onSubmit={handleNameSubmit} className="space-y-4" >
                
                <div className="flex flex-col gap-1">
                <label className="text-gray-800">Display Name:</label>
                {validation? <p className='text-red-500 text-sm'>1 to 20 character</p>: ""}
                <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-200 border border-blue-900/50 p-2 text-black outline-none focus:border-blue-400"
                />
                </div>
                
                <button type="submit" disabled={validation || isLoad} 
                className={`w-full h-12 border ${ validation || isLoad ? "border-gray-500 text-gray-500" :"border-blue-500 text-blue-500 p-2 hover:bg-blue-500/10"}`}>
                {isLoad ? 'SAVING...' : 'Save Name'}
                </button>
            </form>}



            <div className="mt-4 p-3 border-t text-black border-blue-900/20 text-sm space-y-1 ">
                {/* <p>ID: {user.id}</p> */}
                <p>EMAIL: {user.email}</p>
                <p>STATUS: {user.isPro ? "PRO PLAN" : "FREE PLAN"}</p>
            </div>

            
            {user.role !== "ADMIN" && (
                <DeleteButton userId={user.id} />
            )}
        </div>
       
    )
}