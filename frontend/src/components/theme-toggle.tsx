"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) return null;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200 bg-white/80 backdrop-blur-md text-slate-800 transition-all hover:bg-cyan-50 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.15)] dark:shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] dark:hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-cyan-400" />
    </button>
  );
}
