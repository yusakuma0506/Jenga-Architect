'use client';
import {createPortal} from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; 
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  
  return createPortal(
    
    <div className="fixed overflow-hidden inset-0 z-[9999] flex items-center justify-center p-4 h-svh w-screen bg-white">
      <div 
        className="fixed  inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
        onClick={onClose} 
      />

      
      <div className="relative w-full max-w-md bg-white border border-indigo-500 shadow-indigo-300 animate-in zoom-in-95 duration-200 rounded-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-indigo-400 font-mono text-sm tracking-tighter uppercase">{">"} {title}</h2>
            <button onClick={onClose} className="text-indigo-500 hover:text-gray-200 transition-colors">✕</button>
        </div>

        <div className="p-6 max-h-[80vh] bg-white overflow-y-auto rounded-xl">
        {children}
        </div>
        
      </div>  
    </div>,
    document.body
  );
}