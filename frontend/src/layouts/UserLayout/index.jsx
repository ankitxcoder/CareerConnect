import Navbar from "@/Components/Navbar";
import React, { useState, useEffect } from "react";

function UserLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`${isDarkMode ? "dark" : ""} min-h-screen min-h-[100dvh] flex flex-col w-full bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white transition-colors duration-300 relative`}
    >
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] rounded-full"></div>
      </div>
      <div className="relative z-10 flex flex-col flex-1 w-full">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <main className="flex-1 w-full flex flex-col">{children}</main>
      </div>
    </div>
  );
}

export default UserLayout;
