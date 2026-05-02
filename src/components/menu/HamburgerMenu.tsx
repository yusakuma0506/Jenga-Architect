'use client';
import {useState} from "react";
// import AdminActions from "./AdminActions";
import FeedbackTrigger from "./feedback/FeedbackTrigger";
import SettingActions from "./profile/SettingActions";
import {signOut} from "next-auth/react";
import ProfileForm from "./profile/ProfileForm";
import Modal from "../ui/Modal";
import DeleteForm from "./profile/delete/DeleteForm";
import FeedbackForm from "./feedback/FeedbackForm";
import { Role } from "@prisma/client";
import Link from "next/link";

interface UserProps {

    user:{
        id:string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role: string;
        isPro: boolean;
    };
}

type ModelType = "PROFILE" | "FEEDBACK" | "SUBSCRIPTION" | "DELETE" | null;


export default function HamburgerMenu ({user}: UserProps){
    const [isOpen, setIsOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<ModelType>(null);
    const [isLoad, setIsLoad] = useState(false);
    const [linkLoad, setLinkLoad] = useState<string | null>(null);
    const close =()=> {
        setIsOpen(false);
        setActiveModal(null);
    };

    const renderModal =(): React.ReactNode=>{
        if(!activeModal) return null;

        switch(activeModal){

            case "PROFILE":
                return <ProfileForm user={user} />

            case "FEEDBACK":
                return <FeedbackForm user={{
                    id: user.id,
                    name: user.name ?? "",
                    email: user.email ?? "",
                    image: user.image ?? "",
                    role: user.role as Role,
                    isPro: user.isPro
                }}
                onSuccess={()=> setActiveModal(null)} />
                
            case "DELETE":
                return <DeleteForm userId ={user.id}
                 onCancel ={() => setActiveModal(null)}/>
                
            default: 
                return null;
        }
    }


    return(
        <div className="relative font-sans">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-all active:scale-90"
            >
                <span className="text-3xl leading-none font-light">
                    {isOpen ? "✕" : "☰"}
                </span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={close} />

                    <div className="absolute right-[-14.5] mt-5 w-64 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-3 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                    
                        
                        <div className="flex flex-col gap-1">

                            {user.role === "ADMIN" 
                            ? <div>
                                <Link 
                                    href="/" 
                                    onClick={() => {
                                        setLinkLoad("HOME");
                                        close();
                                    }} 
                                    aria-disabled={linkLoad !== null || isLoad}
                                    className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all group aria-disabled:pointer-events-none aria-disabled:opacity-60"
                                >
                                    <span className="text-indigo-400 group-hover:scale-110 transition-transform">🏠</span>
                                    {linkLoad === "HOME" ? "LOADING..." : "HOME"}
                                </Link> 
                                <Link 
                                    href="/usersCheck" 
                                    onClick={() => {
                                        setLinkLoad("USERS");
                                        close();
                                    }} 
                                    aria-disabled={linkLoad !== null || isLoad}
                                    className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all group aria-disabled:pointer-events-none aria-disabled:opacity-60"
                                >
                                    <span className="text-indigo-400 group-hover:scale-110 transition-transform">👥</span>
                                    {linkLoad === "USERS" ? "LOADING..." : "USERS"}
                                </Link> 
                            </div>
                            
                            :""}

                            <SettingActions
                                onOpen={() => setActiveModal("PROFILE")}
                            />

                            <FeedbackTrigger 
                                isAdmin={user.role === "ADMIN"} 
                                onOpen={()=> setActiveModal("FEEDBACK")} />
                        </div>

                       
                       <Link 
                            href="/print-qr" 
                            onClick={() => {
                                setLinkLoad("PRINT");
                                close();
                            }} 
                            aria-disabled={linkLoad !== null || isLoad}
                            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all group aria-disabled:pointer-events-none aria-disabled:opacity-60"
                        >
                            <span className="text-indigo-400 group-hover:scale-110 transition-transform">🖨️</span>
                            {linkLoad === "PRINT" ? "LOADING..." : "PRINT QRs"}
                        </Link> 

                        <div className="my-2 border-t border-slate-100" />

                        <div className="flex flex-col gap-1">
                            
                            <button 
                                onClick={() => {
                                    setIsLoad(true);
                                    signOut({callbackUrl:"/"});
                                }}
                                disabled={isLoad}
                                className="flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-xl text-sm font-bold transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="opacity-70">{isLoad ? '⏳' : '🚪'}</span>
                                {isLoad ? 'LOGGING OUT...' : 'LOGOUT'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <Modal
                isOpen = {activeModal != null}
                title = {activeModal}
                onClose={()=> setActiveModal(null)}
            >
                {renderModal()}
            </Modal>
        </div>
    );
}
