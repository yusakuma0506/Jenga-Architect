'use client'
import Image from "next/image";
import Link from "next/link";

export default function PrintQRs(){
    const blocks = Array.from({ length: 54 }, (_, i) => i + 1);

    return (
    <main suppressHydrationWarning className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
        <div className="print:hidden flex items-center">
            <Link href="/" className="rounded-full">
                <Image
                    className=""
                    src={"/back_arrow.svg"}
                    alt="back to lobby"
                    width={30}
                    height={30}
                />
            </Link>
            <h1 className="text-4xl font-black text-slate-900 uppercase mx-auto">
                QR Printer
            </h1>
        </div>
        
      <div className="max-w-4xl mx-auto my-10 text-center print:hidden">
        
        <p className="text-slate-500 mt-2">
          Print this on sticker paper. Cut and attach to your Jenga blocks.
        </p>
        <button 
          onClick={() => window.print()}
          className="mt-6 px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-[6px_6px_0_0_#3b82f6] hover:bg-blue-600 transition-all active:translate-y-1 active:shadow-none"
        >
          PRINT STICKERS
        </button>
      </div>

      <div className="bg-white p-8 shadow-xl max-w-[210mm] mx-auto rounded-md border-2 border-slate-200 print:shadow-none print:border-none print:p-0">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 print:grid-cols-6 print:gap-2">
          {blocks.map((id) => (
            <div 
              key={id} 
              className="flex flex-col items-center pt-1 border border-slate-100 rounded-sm"
            >
              <span className="text-[9px] font-mono font-bold text-slate-400 mb-1 uppercase tracking-tighter">
                Block {id}
              </span>
              <div className="relative w-15 h-15">
                <Image 
                  src={`/qrs/block_${id}.png`} 
                  alt={`QR Block ${id}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; padding: 0 !important; }
          .print\:hidden { display: none !important; }
          @page { margin: 15mm; }
        }
      `}</style>
    </main>
  );
}