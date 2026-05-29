import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLevel, parseLevel } from "@/lib/user";

async function generateUniqueJoinCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const joinCode = randomBytes(4).toString("hex").toUpperCase();
    const existing = await prisma.room.findUnique({ where: { joinCode } });
    if (!existing) return joinCode;
  }
  throw new Error("Could not generate unique join code");
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { level } = await req.json();
  const parsedLevel = parseLevel(level);

  if (!parsedLevel) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isPro: true, role: true },
  });

  if (!user || !canAccessLevel(user, parsedLevel)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  try {
    const joinCode = await generateUniqueJoinCode();

    const newRoom = await prisma.room.create({
      data: {
        joinCode,
        level: parsedLevel,
        ownerId: session.user.id,
        status: "WAITING",
      },
    });

    await prisma.roomParticipant.create({
      data: {
        roomId: newRoom.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newRoom);
  } catch (error) {
    console.error("Room Creation Error:", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
