"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { UserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggler } from "@/components/theme-toggler";

export default function Header() {
  const { resolvedTheme } = useTheme();
  const { isLoaded } = useUser();
  const isLightTheme = resolvedTheme === "light";

  return (
    <header className="relative flex items-center justify-between border-b py-2 px-2 sm:px-4 gap-2">
      {/* Left section: Sidebar trigger and theme toggler */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-1 sm:mx-2 h-8" />
        <ThemeToggler />
      </div>

      {/* Center section: Title */}
      <div className="flex-1 flex justify-center min-w-0">
        <Link
          href="/groups/today"
          className="group relative inline-block transition-all"
        >
          {/* Background glow effect */}
          <span className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 rounded-lg -z-10" />

          {/* Main text */}
          <span className="relative z-10 block text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] transition-all duration-300">
            Taskflow
          </span>
        </Link>
      </div>

      {/* Right section: User button */}
      <div className="flex items-center flex-shrink-0">
        {!isLoaded ? (
          <Skeleton className="min-w-20 sm:min-w-28 h-8 rounded-full" />
        ) : (
          <UserButton
            appearance={{
              elements: {
                userButtonOuterIdentifier: `${
                  isLightTheme ? "" : "!text-white"
                }`,
              },
            }}
            showName
          />
        )}
      </div>
    </header>
  );
}
