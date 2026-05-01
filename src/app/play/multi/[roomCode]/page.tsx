// src/app/play/multi/[roomCode]/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import RoomLobbyClient from "@/components/RoomLobbyClient";

export default async function RoomLobby({ params }: { params: Promise<{ roomCode: string }> }) {
    const resolvedParams = await params;
    const roomCode = resolvedParams.roomCode;

    const room = await prisma.room.findUnique({
        where: {
            joinCode: roomCode,
        },
        include: {
            participants: { include: { user: true } },
            owner: true,
        },
    });

    if (!room) return <div className="p-10 font-black">Room not found!</div>;

    const session = await getServerSession();
    const isHost = session?.user?.id === room.ownerId;

    return (
        <RoomLobbyClient
            roomCode={room.joinCode}
            initialRoom={room}
            isHost={Boolean(isHost)}
        />
    );
}