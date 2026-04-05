import NextAuth, {DefaultSession, NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import {prisma} from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider  from "next-auth/providers/credentials";

declare module "next-auth" {
    interface Session{
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

declare module "next-auth/jwt"{
    interface JWT{
        id: string;
        role: string;
        isPro: boolean;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // this is for (/secretUser)
        CredentialsProvider({
            name: "debug",
            credentials:{
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials){
                if(credentials?.password !== process.env.DEMO_PASSWORD) return null;
                const user = await prisma.user.findUnique({
                where: { email: credentials?.email }
                });

                if (!user) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isPro: user.isPro
                };
                
            }
        })
    ],
    callbacks:{
        async jwt({token, user, trigger, session}){
            if(user){
                token.id = user.id;
                token.role = user.role || "USER";
                token.email = user.email;
                token.isPro = user.isPro || false;
                token.picture =user.image ||token.picture;
            }
            if(trigger === "update" && session){
                if(session.name) token.name = session.name;
                if(session.image) token.picture =session.image;
                if(session.isPro !== undefined) token.isPro = session.isPro
            }

            return token
        },
        async session({session, token}){
            if(session.user){
                session.user.id = token.id;
                session.user.email= token.email;
                session.user.role = token.role;
                session.user.isPro = token.isPro;
                session.user.name = token.name;
                session.user.image = token.picture;
            }
            return session;
        },
        
    },
    session: {strategy: "jwt"},
    
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST }