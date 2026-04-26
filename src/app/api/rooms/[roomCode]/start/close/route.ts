import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route"

export async function DELETE(
    request: NextRequest,
    context: { params:Promise < { roomCode: string } > }
) {
    const session = await getServerSession(authOptions);
    
    // 2. Await the params to resolve the roomCode
    const { roomCode } = await context.params;

    try {
        // 3. Only the host can delete the room
        await prisma.room.deleteMany({
            where: {
                joinCode: roomCode,
                ownerId: session?.user?.id 
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to close room:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}