import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const quizzes = await prisma.quiz.findMany({
      take: 10,
      select: {
        id: true,
        question: true,
        options: true,
        level: true,
        blockId: true,
        subIndex: true,
        isPremium: true,
        block: {
          select: {
            id: true,
            physicalId: true,
            category: true,
          },
        },
      },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
