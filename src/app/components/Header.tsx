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
    <header className="relative flex items-center border-b py-2 ps-2 pe-4 gap-2">
      {/* Left section: Sidebar trigger and theme toggler */}
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-8" />
        <ThemeToggler />
      </div>

      {/* Center section: Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href="/groups/today" className="text-lg font-semibold">
          Taskflow
        </Link>
      </div>

      {/* Right section: User button */}
      <div className="ms-auto flex items-center">
        {!isLoaded ? (
          <Skeleton className="min-w-28 h-8 rounded-full" />
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
