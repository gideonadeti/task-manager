"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { UserButton, useUser } from "@clerk/nextjs";
import { Keyboard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggler } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import { KeyboardShortcutsDialog } from "./KeyboardShortcutsDialog";

export default function Header() {
  const { resolvedTheme } = useTheme();
  const { isLoaded } = useUser();
  const [mounted, setMounted] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLightTheme = mounted && resolvedTheme === "light";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-between border-b py-2 px-2 sm:px-4 gap-2">
      {/* Left section: Sidebar trigger and theme toggler */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-1 sm:mx-2 h-8" />
        <ThemeToggler />
        <Separator orientation="vertical" className="mx-1 sm:mx-2 h-8" />
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          onClick={() => setShortcutsOpen(true)}
          title="Keyboard shortcuts"
        >
          <Keyboard className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Keyboard shortcuts</span>
        </Button>
      </div>

      {/* Center section: Logo and Title */}
      <div className="flex-1 flex justify-center min-w-0">
        <Link
          href="/groups/today"
          className="group relative inline-flex items-center gap-2 transition-all"
        >
          {/* Background glow effect */}
          <span className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 rounded-lg -z-10" />

          {/* Logo */}
          <div className="relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
            {!mounted ? (
              <div className="h-8 w-8" />
            ) : isLightTheme ? (
              <Image
                key="light"
                src="/images/logo-light.png"
                alt="Taskflow"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
            ) : (
              <Image
                key="dark"
                src="/images/logo-dark.png"
                alt="Taskflow"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
            )}
          </div>

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

      <KeyboardShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </header>
  );
}
