import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ---------------------------------------------------------------------------
// Failed-login throttling. In-memory per-email lockout after repeated
// failures; cheap and correct for a single-instance deployment. Swap for a
// Redis-backed store if the app is ever scaled horizontally.
// ---------------------------------------------------------------------------

const MAX_FAILED = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; lockedUntil: number }>();

function isLocked(email: string): boolean {
  const entry = attempts.get(email);
  if (!entry) return false;
  if (Date.now() >= entry.lockedUntil) {
    attempts.delete(email);
    return false;
  }
  return true;
}

function recordFailure(email: string) {
  const entry = attempts.get(email);
  if (entry) {
    entry.count += 1;
    entry.lockedUntil =
      entry.count >= MAX_FAILED ? Date.now() + WINDOW_MS : entry.lockedUntil;
  } else {
    attempts.set(email, { count: 1, lockedUntil: 0 });
  }
}

function clearFailures(email: string) {
  attempts.delete(email);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();

        // Throttle repeated failures without revealing whether the account exists.
        if (isLocked(email)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          recordFailure(email);
          return null;
        }

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) {
          recordFailure(email);
          return null;
        }

        clearFailures(email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "admin";
      }
      return session;
    },
  },
});
