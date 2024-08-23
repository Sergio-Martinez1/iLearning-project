import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import LogOutButton from '@/app/[lng]/_components/logout'
import SearchBar from '@/app/[lng]/_components/searchBar'
import { MdHome } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaSignInAlt } from "react-icons/fa";
import { redirect } from "next/navigation";
import ThemeButton from '@/app/[lng]/_components/themeButton'
import initTranslations from "@/app/[lng]/i18n";
import TranslationsProvider from "@/app/[lng]/_components/translationsProvider";

const i18nNameSpaces = ["common"];

export default async function RootLayout({
  children, params: { lng }
}: Readonly<{
  children: React.ReactNode, params: { lng: string }
}>) {
  const session = await getServerSession(authOptions)
  const { t, resources } = await initTranslations(lng, i18nNameSpaces);
  if (session && session.status == true) {
    redirect('/login')
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <nav className="w-full h-fit pt-2 md:pt-6 pb-2 flex justify-center bg-[var(--element-color)] md:bg-transparent max-md:shadow-md z-10">
        <ul className="w-fit bg-transparent md:bg-[var(--element-color)] py-2 px-4  rounded-2xl h-full md:flex justify-end items-center gap-x-4 grid grid-cols-4 gap-y-2">
          <li className="hover:text-[var(--accent-color)] col-start-1 col-span-1"><Link href="/dashboard"><MdHome size={25}></MdHome></Link></li>
          <div className="col-start-1 row-start-2 col-span-4 h-full">
            <TranslationsProvider
              resources={resources}
              locale={lng}
              namespaces={i18nNameSpaces}
            >
              <SearchBar></SearchBar>
            </TranslationsProvider>
          </div>
          {session &&
            <li className="hover:text-[var(--accent-color)]"><Link href={`/profile/${session.user?.name}`}><FaUser size={20}></FaUser></Link></li>
          }
          {session && session.role == "admin" &&
            session.role == "admin" &&
            (
              <li className="hover:text-[var(--accent-color)]"><Link href={`/admin`}><MdAdminPanelSettings size={25}></MdAdminPanelSettings></Link></li>
            )
          }
          {session &&
            <LogOutButton></LogOutButton>
          }
          {!session &&
            <div className="flex gap-x-4 justify-center items-center">
              <li className="hover:text-[var(--accent-color)]"><Link href="/login"><FaSignInAlt size={23}></FaSignInAlt></Link></li>
            </div>
          }
          <ThemeButton session={session}></ThemeButton>
        </ul>
      </nav>
      {children}
    </div>
  );
}
