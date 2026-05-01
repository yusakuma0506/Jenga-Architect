import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route"

export async function DELETE(
    request: NextRequest,
    context: { params:Promise < { roomCode: string } > }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { roomCode } = await context.params;

    try {
        const deleted = await prisma.room.deleteMany({
            where: {
                joinCode: roomCode,
                ownerId: session.user.id,
            }
        });

        if (deleted.count === 0) {
            return NextResponse.json({ error: "Room not found or access denied" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to close room:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}