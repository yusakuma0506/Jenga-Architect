import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { level } = await req.json();

    // Generate a unique 6-digit alphanumeric code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
        // 1. Create the room with the selected level
        const newRoom = await prisma.room.create({
            data: {
                joinCode,
                level: level, // ENTRY, JUNIOR, or SENIOR
                ownerId: session.user.id,
                status: 'WAITING',
            }
        });

        // 2. Add the host to the participants list
        await prisma.roomParticipant.create({
            data: {
                roomId: newRoom.id,
                userId: session.user.id
            }
        });

        return NextResponse.json(newRoom);
    } catch (error) {
        console.error("Room Creation Error:", error);
        return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
    }
}