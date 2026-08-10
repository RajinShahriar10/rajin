import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type AdminSession = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
};

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session as AdminSession;
}

export async function isAdmin() {
  const session = await auth();
  return Boolean(session?.user);
}
