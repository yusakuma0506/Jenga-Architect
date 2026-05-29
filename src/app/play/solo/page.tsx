import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import LevelGrid from "./LevelGrid";
import { getAuthenticatedUser } from "@/lib/user";

export default async function SoloModePage() {
  const dbUser = await getAuthenticatedUser();

  if (!dbUser) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 p-4 flex justify-between items-center bg-white">
        <Link
          href="/"
          className="relative block p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Image src="/back_arrow.svg" alt="back" width={32} height={32} />
        </Link>
        <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">
          Solo Mode
        </h2>
      </div>
      <LevelGrid user={dbUser} />
    </main>
  );
}
