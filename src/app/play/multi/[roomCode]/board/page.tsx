import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/user";
import { computeStandings } from "@/lib/multiplayer-scoring";
import RoomBoardClient from "@/components/RoomBoardClient";

export default async function RoomBoardPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = await params;
  const session = await getSessionUser();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const room = await prisma.room.findUnique({
    where: { joinCode: roomCode },
    include: {
      participants: { include: { user: true } },
    },
  });

  if (!room) return notFound();

  if (room.status === "WAITING") {
    redirect(`/play/multi/${roomCode}`);
  }

  const isParticipant = room.participants.some(
    (p) => p.userId === session.user.id
  );
  if (!isParticipant) {
    redirect("/");
  }

  const standings = computeStandings(
    room.participants.map((p) => ({
      userId: p.userId,
      name: p.user.name?.split(" ")[0] ?? "PLAYER",
      image: p.user.image,
      totalScore: p.totalScore,
      isEliminated: p.isEliminated,
    }))
  );

  return (
    <RoomBoardClient
      roomCode={room.joinCode}
      initialRoom={{ ...room, standings }}
      isHost={session.user.id === room.ownerId}
      currentUserId={session.user.id}
    />
  );
}
