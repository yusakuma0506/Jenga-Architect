import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ roomCode: string }> }) {
    const session = await getServerSession(authOptions);
    const { roomCode } = await params;

    try {
        const room = await prisma.room.findUnique({
        where: { joinCode: roomCode },
        });

        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
        if (room.ownerId !== session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updatedRoom = await prisma.room.update({
        where: { joinCode: roomCode },
        data: { status: 'PLAYING' }, 
        });

        return NextResponse.json(updatedRoom);
    } catch (error) {
        return NextResponse.json({ error: "Failed to start" }, { status: 500 });
    }
}