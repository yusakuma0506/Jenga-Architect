// src/app/play/multi/[roomCode]/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Image from "next/image";
import StartGameButton from "@/components/ui/StartGameButton"; // Make sure this import exists

export default async function RoomLobby({ params }: { params: Promise<{ roomCode: string }> }) {
    // 1. Await the params first!
    const resolvedParams = await params;
    const roomCode = resolvedParams.roomCode;

    const room = await prisma.room.findUnique({
        where: { 
            joinCode: roomCode // Now this won't be undefined
        },
        include: { 
            participants: { include: { user: true } },
            owner: true 
        }
    });

    if (!room) return <div className="p-10 font-black">Room not found!</div>;

    const session = await getServerSession();
    // Use email check or ID check
    const isHost = session?.user?.email === room.owner.email;

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6">
            <div className="mt-12 text-center">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Join Code</p>
                <h1 className="text-6xl font-black border-4 border-slate-900 px-6 py-2 rounded-2xl shadow-[6px_6px_0_0_#000] mb-10">
                    {room.joinCode}
                </h1>
            </div>

            <div className="w-full max-w-sm bg-slate-50 border-4 border-slate-900 rounded-[40px] p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-black text-lg">PLAYERS</h2>
                    <span className="font-black bg-slate-900 text-white px-3 py-1 rounded-full text-sm">
                        {room.participants.length} / 6
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {room.participants.map((p) => (
                        <div key={p.id} className="flex flex-col items-center">
                            <Image
                                src={p.user.image || "/default_photo.jpg"} 
                                alt="profile"
                                width={56}
                                height={56}
                                className="w-14 h-14 rounded-full border-4 border-slate-900 object-cover" 
                            />
                            <p className="text-[10px] font-black mt-1 truncate w-16 text-center">
                                {p.user.name?.split(' ')[0]}
                            </p>
                        </div>
                    ))}
                    {Array.from({ length: 6 - room.participants.length }).map((_, i) => (
                        <div key={i} className="w-14 h-14 rounded-full border-4 border-dashed border-slate-200" />
                    ))}
                </div>
            </div>

            {isHost && (
                <StartGameButton roomCode={room.joinCode} />
            )}
        </div>
    );
}