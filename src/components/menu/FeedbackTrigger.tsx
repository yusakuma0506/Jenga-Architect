'use client';
import Link from 'next/link';



export default function FeedbackTrigger({isAdmin}: {isAdmin:boolean}){
    if(isAdmin){
        return(
            <Link 
                href = "/admin?tab=feedback" 
                className="text-amber-500 hover:text-amber-300 text-xs uppercase transition-colors p-1 cursor-pointer"
            >
                {">"} View Report
            </Link>
        );
    }

    return(
        <button
            className="text-blue-400 hover:text-white text-xs uppercase transition-colors p-1 text-left cursor-pointer"
            onClick= {()=> alert("open feedback component")}
        >
            {">"} Feedback
        </button>
    );
    
}