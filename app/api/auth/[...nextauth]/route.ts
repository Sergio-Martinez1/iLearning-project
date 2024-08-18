import NextAuth from "next-auth";
import { authOptions } from "@/libs/auth";

declare module 'next-auth' {
  interface Session {
    role?: string;
  }

  interface Token {
    role?: string;
  }
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }