import Nav from "@/components/Nav";
import Users from "@/components/menu/Users";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";

export default async function UsersCheck() {
  const dbUser = await getAuthenticatedUser();

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/");
  }

  const allUsers = await prisma.user.findMany();

  return (
    <div className="font-sans">
      <Nav user={dbUser} />
      <Users allUsers={allUsers} />
    </div>
  );
}
