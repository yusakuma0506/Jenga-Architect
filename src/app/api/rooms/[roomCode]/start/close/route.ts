import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function DELETE(req: Request, { params }: { params: { roomCode: string } }) {
    const session = await getServerSession();
    
    // Only the host can delete the room
    await prisma.room.deleteMany({
        where: {
            joinCode: params.roomCode,
            ownerId: session?.user?.id // Security check
        }
    });

    return NextResponse.json({ success: true });
}