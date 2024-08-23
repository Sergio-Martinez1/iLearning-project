"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";

function LogOutButton() {
  const router = useRouter();

  return (
    <button
      className="p-0 pl-0.5 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full"
      onClick={() => {
        signOut();
        router.refresh("/");
      }}
    >
      <MdLogout size={25}></MdLogout>
    </button>
  );
}

export default LogOutButton;
