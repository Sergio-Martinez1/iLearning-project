import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from '@/db/db_config'
import User from '@/db/models/user.models'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
    interface Session {
        role?: string;
        reactions?: Array<Number>;
        status?: Boolean;
        theme?: string;
    }

    interface Token {
        role?: string;
        reactions?: Array<Number>;
        status?: Boolean;
        theme?: string;
    }
}



export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials) {
                const email = credentials?.email;
                const password = credentials?.password as string;
                try {
                    await connectDB()
                    const userFound = await User.findOne({ email })

                    if (!userFound) throw new Error('Email not found')

                    const isMatch = await bcrypt.compare(password, userFound.password)

                    if (!isMatch) throw new Error('Wrong credentials')

                    if (userFound.status == true) throw new Error('User is blocked')

                    return {
                        id: userFound._id,
                        name: userFound.username,
                        email: userFound.email,
                    }
                } catch (error) {
                    throw new Error((error as Error).message);
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
        error: "/register"
    },
    callbacks: {
        async jwt({ token }) {
            try {
                if (!token) return token;
                await connectDB()
                const userFound = await User.findOne({ username: token.name })
                if (!userFound) throw new Error('User not found')
                token.role = userFound.role
                token.reactions = userFound.reactions
                token.status = userFound.status
                token.theme = userFound.theme
                return token;
            } catch (error) {
                throw new Error((error as Error).message);
            }
        },
        async session({ session, token }) {
            if (token.role) {
                session.role = token.role as string
            }
            if (token.reactions) {
                session.reactions = token.reactions as Array<Number>
            }
            if (token.status != null) {
                session.status = token.status as Boolean
            }
            if (token.theme) {
                session.theme = token.theme as string
            }
            return session;
        },
    }
}