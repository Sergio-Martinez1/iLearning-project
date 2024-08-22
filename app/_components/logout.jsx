"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";

function LogOutButton() {
  const router = useRouter();
  return (
    <button
    className="px-1 pl-1.5 py-1 flex items-center justify-center w-fit h-fit"
      onClick={() => {
        signOut();
        router.push('/')
      }}
    >
      <MdLogout size={20}></MdLogout>
    </button>
  );
}

export default LogOutButton;
