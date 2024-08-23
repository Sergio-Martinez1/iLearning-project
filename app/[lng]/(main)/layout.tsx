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
import SessionWrapper from "@/app/[lng]/_components/sessionWrapper"
import ChangeLocale from "@/app/[lng]/_components/changeLocale"

const i18nNameSpaces = ["common"];

export default async function RootLayout({
  children, params: { lng }
}: Readonly<{
  children: React.ReactNode, params: { lng: string }
}>) {
  const session = await getServerSession(authOptions)
  const { t, resources } = await initTranslations(lng, i18nNameSpaces);
  let grid_style = "grid-cols-4"
  let search_bar_size = "col-span-4"
  if (session && session.status == true) {
    redirect('/login')
  }
  if (session && session.role === "admin") {
    grid_style = "grid-cols-6"
    search_bar_size = "col-span-6"
  } else if (session && session.role == "user") {
    grid_style = "grid-cols-5"
    search_bar_size = "col-span-5"
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <nav className="w-full h-fit md:h-24 pt-2 md:pt-6 pb-2 flex justify-center bg-[var(--element-color)] md:bg-transparent max-md:shadow-md z-20">
        <ul className={`w-fit bg-transparent md:bg-[var(--element-color)] py-2 px-4  rounded-2xl h-full md:flex items-center gap-x-4 grid  ${grid_style} gap-y-2 justify-items-center`}>
          <li className="hover:text-[var(--accent-color)] col-start-1 col-span-1 w-fit"><Link href="/dashboard"><MdHome size={33}></MdHome></Link></li>
          <div className={`col-start-1 row-start-2 ${search_bar_size}  h-full`}>
            <TranslationsProvider
              resources={resources}
              locale={lng}
              namespaces={i18nNameSpaces}
            >
              <SearchBar></SearchBar>
            </TranslationsProvider>
          </div>
          {session &&
            <li className="hover:text-[var(--accent-color)]"><Link href={`/profile/${session.user?.name}`}><FaUser size={25}></FaUser></Link></li>
          }
          {session && session.role == "admin" &&
            session.role == "admin" &&
            (
              <li className="hover:text-[var(--accent-color)]"><Link href={`/admin`}><MdAdminPanelSettings size={35}></MdAdminPanelSettings></Link></li>
            )
          }
          <ChangeLocale></ChangeLocale>
          <ThemeButton session={session}></ThemeButton>
          {session &&
            <SessionWrapper>
              <LogOutButton></LogOutButton>
            </SessionWrapper>
          }
          {!session &&
            <div className="flex gap-x-4 justify-center items-center">
              <li className="hover:text-[var(--accent-color)]"><Link href="/login"><FaSignInAlt size={30}></FaSignInAlt></Link></li>
            </div>
          }
        </ul>
      </nav>
      {children}
    </div>
  );
}
