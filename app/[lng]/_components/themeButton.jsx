"use client";
import { useEffect } from "react";
import { CgDarkMode } from "react-icons/cg";

function ThemeButton({ session }) {
  const baseURL = process.env.NEXTAUTH_URL || "";

  async function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    await fetch(`${baseURL}/api/theme/${newTheme}`, { method: "PUT" });
  }

  return (
    <button onClick={toggleTheme}>
      <CgDarkMode></CgDarkMode>
    </button>
  );
}

export default ThemeButton;
