import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import RoomLobbyClient from "@/components/RoomLobbyClient";
import { getSessionUser } from "@/lib/user";

export default async function RoomLobby({
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
      owner: true,
    },
  });

  if (!room) return notFound();

  if (room.status === "PLAYING") {
    redirect(`/play/multi/${roomCode}/board`);
  }

  const isParticipant = room.participants.some(
    (p) => p.userId === session.user.id
  );
  if (!isParticipant) {
    redirect("/");
  }

  return (
    <RoomLobbyClient
      roomCode={room.joinCode}
      initialRoom={room}
      isHost={session.user.id === room.ownerId}
    />
  );
}
