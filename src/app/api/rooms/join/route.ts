import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { joinCode } = await req.json();

  try {
    const room = await prisma.room.findUnique({
      where: { joinCode: joinCode.toUpperCase() },
    });

    if (!room || room.status !== "WAITING") {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (room.createdAt < oneHourAgo) {
      return NextResponse.json({ error: "Room has expired" }, { status: 410 });
    }

    await prisma.roomParticipant.upsert({
      where: {
        roomId_userId: {
          roomId: room.id,
          userId: session.user.id,
        },
      },
      update: {},
      create: {
        roomId: room.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, joinCode: room.joinCode });
  } catch {
    return NextResponse.json({ error: "Join failed" }, { status: 500 });
  }
}
