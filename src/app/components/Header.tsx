"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { UserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  const { resolvedTheme } = useTheme();
  const { isLoaded } = useUser();
  const isLightTheme = resolvedTheme === "light";

  return (
    <header className="flex items-center border-b py-2 ps-2 pe-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-2" />
      <Link href="/groups/today" className="text-lg font-semibold">
        Taskflow
      </Link>
      <div className="ms-auto">
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
