import Link from "next/link";
import { MdHome } from "react-icons/md";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="w-full h-screen flex flex-col">
      <nav className="w-full h-fit pt-6 pb-2 flex justify-center bg-transparent">
        <ul className="w-fit bg-[var(--element-color)] py-2 px-4  rounded-2xl h-full flex justify-end items-center gap-x-4 gap-y-2">
          <li className="hover:text-[var(--accent-color)] col-start-1 col-span-1"><Link href="/dashboard"><MdHome size={25}></MdHome></Link></li>
        </ul>
      </nav>
      {children}
    </div>
  );
}
