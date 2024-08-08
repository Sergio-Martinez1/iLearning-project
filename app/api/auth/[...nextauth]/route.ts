import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '../../../db/db_config'
import User from '../../../models/user.models'
import bcrypt from 'bcryptjs'

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password as string;
        try {
          await connectDB()
          const userFound = await User.findOne({ email })
          if (!userFound) throw new Error('Email not found')

          const isMatch = await bcrypt.compare(password, userFound.password)

          if (!isMatch) throw new Error('Wrong credentials')

          return {
            id: userFound.id,
            name: userFound.username,
            email: userFound.email
          }
        } catch (error) {
          console.log(error)
          throw new Error('Server Error')
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login"
  }
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
