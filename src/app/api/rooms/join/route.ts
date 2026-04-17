import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { joinCode } = await req.json();

    try {
        const room = await prisma.room.findUnique({
            where: { joinCode: joinCode.toUpperCase() }
        });

        if (!room || room.status !== 'WAITING') {
            return NextResponse.json(
                { error: "Room not found" }, 
                { status: 404 });
            }
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (room.createdAt < oneHourAgo) {
            return NextResponse.json({ error: "Room has expired" }, { status: 410 });
        }

        // Add the current user to the room participants
        const participant = await prisma.roomParticipant.upsert({
            where: {
                roomId_userId: {
                    roomId: room.id,
                    userId: session.user.id
                }
            },
            update: {}, // If already joined, do nothing
            create: {
                roomId: room.id,
                userId: session.user.id
            }
        });

        if (!participant) {
            return NextResponse.json(
                { error: "Failed to join" },
                { status: 500 });
        }

        return NextResponse.json({ success: true, joinCode: room.joinCode });
    } catch (error) {
        return NextResponse.json({ error: "Join failed" }, { status: 500 });
    }
}