import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await context.params;

  const room = await prisma.room.findUnique({
    where: { joinCode: roomCode },
    include: {
      participants: { include: { user: true } },
      owner: true,
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(room);
}
