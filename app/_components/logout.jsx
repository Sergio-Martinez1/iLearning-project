"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function LogOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        signOut();
        router.push('/')
      }}
    >
      LogOut
    </button>
  );
}

export default LogOutButton;
