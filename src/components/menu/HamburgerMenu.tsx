'use client';
import Link from "next/link";
import {useState} from "react";
// import AdminActions from "./AdminActions";
import FeedbackTrigger from "./FeedbackTrigger";
import SettingActions from "./profile/SettingActions";
import {signOut} from "next-auth/react";
import ProfileForm from "./profile/ProfileForm";
import Modal from "../ui/Modal";

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

type ModelType = "PROFILE" | "FEEDBACK" | "SUBSCRIPTION" |null;


export default function HamburgerMenu ({user}: UserProps){
    const [isOpen, setIsOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<ModelType>(null);

    const close =()=> {
        setIsOpen(false);
        setActiveModal(null);
    };



    // return(
    //     <div className="relative font-sans">
    //         <button 
    //             onClick={() => setIsOpen(!isOpen)}
    //             className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transistion-all active:scale-90"
    //         >
    //             {isOpen ? "✕" : "☰"}
    //         </button>

    //         {isOpen && (
    //             <div className="absolute right-[-14] mt-4 w-64 bg-black border border-blue-900 shadow-[0_0_40px_rgba(0,0,255,0.2)] p-4 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200 z-[100]">
                
    //                 <div className="flex flex-col gap-3">
    //                     <Link href="/" onClick={close} className="text-blue-400 hover:text-white text-xs uppercase transition-colors p-1">
    //                     {">"} Home
    //                     </Link>

    //                     <SettingActions
    //                         onOpen={() => setActiveModal("PROFILE")}
    //                     />

    //                     <FeedbackTrigger isAdmin={user.role === "ADMIN"} />


    //                     {/* {user.role === "ADMIN" && <AdminActions />} */}
    //                 </div>

    //                 <div>

    //                 </div>

    //                 {/* DANGER ZONE / SESSION */}
    //                 <div className="border-t border-blue-900/50 pt-4 flex flex-col gap-3">
    //                     <button 
    //                     onClick={() => signOut()}
    //                     className="text-red-500 text-left text-xs uppercase p-1 hover:text-white transition-colors cursor-pointer"
    //                     >
    //                     {">"} Logout
    //                     </button>
                        
    //                 </div>

    //                 <Modal
    //                     isOpen = {activeModal === "PROFILE"}
    //                     title = "User Profile"
    //                     onClose={()=> setActiveModal(null)}
    //                 >
    //                     <ProfileForm user={user} />
    //                 </Modal>
    //             </div>
    //         )}

    //         <div>

    //         </div>
    //     </div>


    // );

    return(
        <div className="relative font-sans"> {/* EdTechの親しみやすさのためにsansを推奨 */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-all active:scale-90"
            >
                <span className="text-2xl leading-none font-light">
                    {isOpen ? "✕" : "☰"}
                </span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={close} />

                    <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-3 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                    
                        <div className="flex flex-col gap-1">
                            <Link 
                                href="/" 
                                onClick={close} 
                                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all group"
                            >
                                <span className="text-indigo-400 group-hover:scale-110 transition-transform">🏠</span>
                                HOME
                            </Link>

                            <SettingActions
                                onOpen={() => setActiveModal("PROFILE")}
                            />

                            <FeedbackTrigger isAdmin={user.role === "ADMIN"} />
                        </div>

                        {/* セパレーター */}
                        <div className="my-2 border-t border-slate-100" />

                        {/* DANGER ZONE / SESSION */}
                        <div className="flex flex-col gap-1">
                            <button 
                                onClick={() => signOut()}
                                className="flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-xl text-sm font-bold transition-all text-left"
                            >
                                <span className="opacity-70">🚪</span>
                                LOGOUT
                            </button>
                        </div>
                    </div>
                </>
            )}

            <Modal
                isOpen = {activeModal === "PROFILE"}
                title = "User Profile"
                onClose={()=> setActiveModal(null)}
            >
                <ProfileForm user={user} />
            </Modal>
        </div>
    );
}