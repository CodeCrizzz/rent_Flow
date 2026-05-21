"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

function ThemeTransitionHelper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const mounted = React.useRef(false);

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    document.documentElement.classList.add("theme-transitioning");
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 300);

    return () => clearTimeout(timer);
  }, [theme]);

  return <>{children}</>;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeTransitionHelper>{children}</ThemeTransitionHelper>
    </NextThemesProvider>
  );
}
