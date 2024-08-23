"use client";
import { useState } from "react";
import { CgDarkMode } from "react-icons/cg";
import { IoSunnyOutline } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";

function ThemeButton({ session }) {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [theme, setTheme] = useState("light");

  async function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    await fetch(`${baseURL}/api/theme/${newTheme}`, { method: "PUT" });
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-0 m-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex justify-center items-center"
    >
      {theme === "light" ? <FaMoon size={22} /> : <IoSunnyOutline size={25} />}
    </button>
  );
}

export default ThemeButton;
