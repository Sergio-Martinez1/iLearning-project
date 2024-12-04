"use client";

import { useEffect, useState } from "react";
import { PiClockAfternoon } from "react-icons/pi";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";

function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const baseURL = process.env.NEXTAUTH_URL || "";
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function toggleTheme(theme) {
    await fetch(`${baseURL}/api/theme/${theme}`, { method: "PUT" });
  }

  if (!mounted) return (
    <PiClockAfternoon size={22} />
  );

  if (resolvedTheme === 'dark') {
    return <FaSun size={22} onClick={() => {
      setTheme('light');
      toggleTheme('light');
    }} />
  };

  if (resolvedTheme === 'light') {
    return <FaMoon size={22} onClick={() => {
      setTheme('dark');
      toggleTheme('dark')
    }} />
  };
}

export default ThemeButton;
