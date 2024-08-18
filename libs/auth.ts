import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from '@/db/db_config'
import User from '@/db/models/user.models'
import bcrypt from 'bcryptjs'

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

                    return {
                        id: userFound._id,
                        name: userFound.username,
                        email: userFound.email,
                    }
                } catch (error) {
                    throw new Error('Server Error')
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/login"
    },
    callbacks: {
        async jwt({ token }) {
            try {
                if (!token) return token;
                await connectDB()
                const userFound = await User.findOne({ username: token.name })
                if (!userFound) throw new Error('User not found')
                token.role = userFound.role
                return token;
            } catch (error) {
                throw new Error('Server Error')
            }
        },
        async session({ session, token }) {
            if (token.role) {
                session.role = token.role as string
            }
            return session;
        },
    }
}