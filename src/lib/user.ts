import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppUser, userSelect } from "@/types/user";

export { canAccessLevel, parseLevel, isPremiumLevel } from "@/lib/levels";

export async function getSessionUser() {
  return getServerSession(authOptions);
}

export async function getDbUser(userId: string): Promise<AppUser | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });
}

export async function getAuthenticatedUser(): Promise<AppUser | null> {
  const session = await getSessionUser();
  if (!session?.user?.id) return null;
  return getDbUser(session.user.id);
}
