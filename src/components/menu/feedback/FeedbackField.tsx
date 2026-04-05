'use client'
import { feedbackReadUpdate } from '@/actions/feedback';
import {useRouter} from 'next/navigation';
import { FeedbackWithUser } from '@/app/feedback/page';

export default function FeedbackField({feedbacks}:{feedbacks: FeedbackWithUser[]}){
    const router = useRouter();

    if(feedbacks.length ===0){
        return <p className="text-center text-slate-400 py-10">No feedback found.</p>;
    }

    return (
        <div className="grid gap-4 p-2 max-w-4xl mx-auto">
            {feedbacks.map((item)=>(
                <div key={item.id} className="p-6 bg-white border rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-600">{item.user?.email || "Anonymous"}</span>
                        <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>

                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-600">{item.type}</span>
                        {item.read? <span className="text-xs text-slate-400">READ</span> :
                        <button 
                            className="text-xs text-blue-600 font-bold hover:underline"
                            onClick={async ()=>{
                                feedbackReadUpdate(item.id, )
                                router.refresh()
                             }}
                        >
                            UNREAD
                        </button>}
                        
                    </div>
                    <p className="text-slate-800">{item.content}</p>
    
                </div>
            ))}

        </div>

    )

}