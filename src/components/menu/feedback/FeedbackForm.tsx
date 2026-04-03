'use client';
import { createNewFeedback } from "@/actions/feedback";
import {User} from "@prisma/client"

type FeedbackUser = Pick<User, "id" | "name" | "email" | "image" | "role" | "isPro">

export default function FeedbackForm({user, onSuccess}: {user:FeedbackUser, onSuccess?: ()=>void}){
    const handleSubmit = async(formData:FormData) =>{
        const result =await createNewFeedback(formData)
        if(result.success){
            alert("Feedback saved!");
            if(onSuccess)onSuccess();
        } else {
            alert(result.error);
        }

    }

    return(
        <div>
            <div className="flex flex-col gap-2">
                <h2><span className="text-md font-bold text-slate-400 ml-1">Name: </span>{user.name}</h2>
                <h2><span className="text-md font-bold text-slate-400 ml-1">Email: </span>{user.email}</h2>
            </div>
            <form action={handleSubmit}
            className="space-y-4"
            >
                <div className="flex flex-col gap-1 mt-3">
                    <label className="text-md font-bold text-slate-400 ml-1">
                        CATEGORY:
                    </label>
                    <select name="type" className="p-2">
                        <option value="SUGGESTION">💡 Suggestion</option>
                        <option value="BUG">🐛 Bug Report</option>
                        <option value="TYPO">✍️ Typo</option>
                        <option value="Quiz">🧩 Quiz Issue</option>
                        <option value="OTHER">❓ Other</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-md font-bold text-slate-400 ml-1">MESSAGE</label>
                    <textarea name="content" 
                        required
                        placeholder="What's on your mind?"
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm min-h-[150px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                    SUBMIT REPORT
                </button>

            </form>
        </div>
        
    );

}