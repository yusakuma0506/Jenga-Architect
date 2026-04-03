'use client';
import { useState } from 'react';
import { deleteUserAccount } from '@/actions/profile';
import { signOut } from 'next-auth/react';


export default function DeleteForm({ userId, onCancel }: { userId: string, onCancel: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you absolutely sure? This cannot be undone.")) return;
        
        setIsLoading(true);
        const result = await deleteUserAccount(userId);
        if (result.success) {
            signOut({ callbackUrl: "/" }); 
        } else {
            alert("Error deleting account.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-2">
            <div className="bg-rose-50 p-4 rounded-xl text-rose-700 text-sm">
                <p className="font-bold mb-1">🚫 Warning</p>
                <p>All your data, including quiz results and progress, will be permanently removed.</p>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="w-full py-4 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 disabled:bg-slate-300 transition-all"
                >
                    {isLoading ? "Deleting..." : "YES, DELETE EVERYTHING"}
                </button>
                <button
                    onClick={onCancel}
                    className="w-full py-3 text-slate-500 font-semibold hover:underline"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}