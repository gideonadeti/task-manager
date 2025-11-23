"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { UserButton, useUser } from "@clerk/nextjs";
import { Keyboard } from "lucide-react";
import { motion } from "motion/react";
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
  const [isMobile, setIsMobile] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isLightTheme = mounted && resolvedTheme === "light";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-between border-b py-2 px-2 sm:px-4 gap-2">
      {/* Left section: Sidebar trigger and keyboard shortcuts */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <SidebarTrigger />
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
        <motion.div
          className="relative inline-flex items-center gap-2"
          whileHover="hover"
          initial="initial"
        >
          <Link href="/" className="relative inline-flex items-center gap-2">
            {/* Background glow effect with Motion animation */}
            <motion.span
              className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 rounded-lg -z-10"
              variants={{
                initial: { opacity: 0, scale: 0.95, filter: "blur(16px)" },
                hover: {
                  opacity: 0.6,
                  scale: 1.05,
                  filter: "blur(24px)",
                },
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            />

            {/* Logo with scale/pulse animation */}
            <motion.div
              className="relative z-10"
              variants={{
                initial: {
                  scale: 1,
                  filter: isLightTheme
                    ? "drop-shadow(0 0 0px rgba(59,130,246,0))"
                    : "drop-shadow(0 0 0px rgba(96,165,250,0))",
                },
                hover: {
                  scale: [1, 1.1, 1.05],
                  filter: isLightTheme
                    ? [
                        "drop-shadow(0 0 0px rgba(59,130,246,0))",
                        "drop-shadow(0 0 12px rgba(59,130,246,0.6))",
                        "drop-shadow(0 0 8px rgba(59,130,246,0.5))",
                      ]
                    : [
                        "drop-shadow(0 0 0px rgba(96,165,250,0))",
                        "drop-shadow(0 0 12px rgba(96,165,250,0.6))",
                        "drop-shadow(0 0 8px rgba(96,165,250,0.5))",
                      ],
                },
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              {!mounted ? (
                <div className="size-8" />
              ) : isLightTheme ? (
                <Image
                  key="light"
                  src="/images/logo-light.png"
                  alt="Taskflow"
                  width={32}
                  height={32}
                  className="size-8"
                  priority
                />
              ) : (
                <Image
                  key="dark"
                  src="/images/logo-dark.png"
                  alt="Taskflow"
                  width={32}
                  height={32}
                  className="size-8"
                  priority
                />
              )}
            </motion.div>

            {/* Main text with Motion gradient animation */}
            <motion.span
              className="relative z-10 block text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
              style={{
                backgroundPosition: "0% 50%",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              variants={{
                initial: {
                  filter: isLightTheme
                    ? "drop-shadow(0 0 0px rgba(59,130,246,0))"
                    : "drop-shadow(0 0 0px rgba(96,165,250,0))",
                },
                hover: {
                  filter: isLightTheme
                    ? [
                        "drop-shadow(0 0 0px rgba(59,130,246,0))",
                        "drop-shadow(0 0 12px rgba(59,130,246,0.6))",
                        "drop-shadow(0 0 8px rgba(59,130,246,0.5))",
                      ]
                    : [
                        "drop-shadow(0 0 0px rgba(96,165,250,0))",
                        "drop-shadow(0 0 12px rgba(96,165,250,0.6))",
                        "drop-shadow(0 0 8px rgba(96,165,250,0.5))",
                      ],
                },
              }}
            >
              Taskflow
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Right section: User button and theme toggler */}
      <div className="flex items-center gap-1 flex-shrink-0">
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
            showName={!isMobile}
          />
        )}
        <Separator orientation="vertical" className="mx-1 sm:mx-2 h-8" />
        <ThemeToggler />
      </div>

      <KeyboardShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </header>
  );
}
