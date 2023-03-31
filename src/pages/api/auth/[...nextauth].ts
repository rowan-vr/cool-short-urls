import NextAuth, {AuthOptions, User} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {prisma} from "@/database";
import bcrypt from 'bcrypt';

export const authOptions:AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials) return null;

                const user = await prisma.user.findUnique({where: {username: credentials.username}});

                if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
                    return null
                } else {
                    // @ts-ignore
                    delete user.password;
                    return user
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.user = token;

            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {

            token = {...token, ...user};

            return token
        }
    }
}

export default NextAuth(authOptions)