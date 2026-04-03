'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import DeleteForm from './DeleteForm'; // 後述

export default function DeleteButton({ userId }: { userId: string }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <div className="mt-2 pt-4 border-t border-rose-100">
            <p className="text-sm text-slate-400 mb-2 font-bold">DANGER ZONE</p>
            <button
                onClick={() => setIsConfirmOpen(true)}
                className="w-full py-2 px-2 rounded-xl border-2 border-rose-100 text-rose-500 font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2 group"
            >
                <span className="group-hover:animate-bounce">⚠️</span>
                DELETE ACCOUNT
            </button>

            <Modal 
                isOpen={isConfirmOpen} 
                onClose={() => setIsConfirmOpen(false)}
                title="Account Deletion"
            >
                <DeleteForm userId={userId} onCancel={() => setIsConfirmOpen(false)} />
            </Modal>
        </div>
    );
}