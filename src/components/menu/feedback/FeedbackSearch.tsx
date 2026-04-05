'use client';
import {useState} from 'react';
import FeedbackField from './FeedbackField';
import { FeedbackWithUser } from '@/app/feedback/page';

export default function ReedbackCheck({initialData}: {initialData:FeedbackWithUser[]}){
    const [search, setSearch] = useState<string>("all");
    const [isAsc, setIsAsc] = useState<boolean>(false);

    const filteredFeedbacks = initialData
        .filter((item)=>{
            if(search === "read") return item.read ===true;
            if(search === "unread") return item.read ===false;
            return true
        })
        .sort((a,b)=>{
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return isAsc? dateA - dateB: dateB - dateA;
        })


    return(
        <div className='min-h-screen w-full '>
        
            <div className='flex sticky top-20 bg-white justify-around flex-wrap  gap-1 p-2 border-b border-gray-200'>
                {["all", "read", "unread"].map((option)=>(
                    <button
                        key={option}
                        onClick ={()=> setSearch(option)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                            search === option 
                                ? "bg-white text-blue-600 shadow-sm" 
                                : "text-slate-500 hover:text-black"
                            }`}
                    >
                        {option.toUpperCase()}

                    </button>
                ))}
                <button 
                    onClick={() => setIsAsc(!isAsc)}
                    className="flex items-center  px-4 py-2 border-2 rounded-xl hover:bg-slate-50 hover:border-blue-600 font-bold text-sm"
                >
                    Date {isAsc ? "↑" : "↓"}
                </button>
                
            </div>

            <FeedbackField feedbacks={filteredFeedbacks}/>


        </div>

    )
}