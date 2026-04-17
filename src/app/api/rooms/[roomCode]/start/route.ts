import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { roomCode: string } }
) {
  try {
    // 1. Update the status so scanning blocks becomes active
    const updatedRoom = await prisma.room.update({
      where: { joinCode: params.roomCode },
      data: { status: 'PLAYING' }, //
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    return NextResponse.json({ error: "Failed to start game" }, { status: 500 });
  }
}