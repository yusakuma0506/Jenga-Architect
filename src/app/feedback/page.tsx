import Nav from "@/components/Nav";
import FeedbackSearch from "@/components/menu/feedback/FeedbackSearch";
import { Feedback, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";

export interface FeedbackWithUser extends Feedback {
  user: Pick<User, "email"> | null;
}

export default async function FeedbackAdmin() {
  const dbUser = await getAuthenticatedUser();

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/");
  }

  const allFeedbacks = await prisma.feedback.findMany({
    include: { user: true },
  });

  return (
    <div className="font-sans">
      <Nav user={dbUser} />
      <FeedbackSearch initialData={allFeedbacks} />
    </div>
  );
}
