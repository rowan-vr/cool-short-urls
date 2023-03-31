import NextAuth, { DefaultSession } from "next-auth"
import {User as PrismaUser} from "@prisma/client"

declare module "next-auth" {
    interface Session{
        user: Omit<PrismaUser,'password'>;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends Omit<PrismaUser,'password'>{}
}