import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import LogOutButton from '@/app/_components/logout'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-full h-screen flex flex-col">
          <nav className="w-full bg-[var(--element-color)] h-16 p-2">
            <ul className="w-full h-full flex justify-end items-center gap-x-4">
              <li><Link href="/dashboard">Home</Link></li>
              {session ?
                <div className="flex gap-x-4 items-center">
                  <li><Link href={`/profile/${session.user?.name}`}>Profile</Link></li>
                  <LogOutButton></LogOutButton>
                </div>
                :
                <div className="flex gap-x-4">
                  <li><Link href="/login">Login</Link></li>
                  <li><Link href="/register">Sign up</Link></li>
                </div>
              }
            </ul>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
