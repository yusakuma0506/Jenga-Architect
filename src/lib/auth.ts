import { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isPro: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    role: string;
    isPro: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isPro: boolean;
  }
}

const oauthProviders = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  GithubProvider({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
  }),
];

const demoCredentialsProvider =
  process.env.DEMO_PASSWORD
    ? [
        CredentialsProvider({
          name: "Admin / Demo",
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            if (credentials?.password !== process.env.DEMO_PASSWORD) return null;

            const user = await prisma.user.findUnique({
              where: { email: credentials?.email },
            });

            if (!user) return null;

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              isPro: user.isPro,
            };
          },
        }),
      ]
    : [];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [...oauthProviders, ...demoCredentialsProvider],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "NORMAL";
        token.email = user.email;
        token.isPro = user.isPro || false;
        token.picture = user.image || token.picture;
      }

      // Client may only update display fields — never role or isPro
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
      }

      // Always refresh privileged fields from DB so JWT cannot be self-elevated
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, isPro: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.isPro = dbUser.isPro;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.isPro = token.isPro;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};
