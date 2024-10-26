import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  return (
    <header className="flex items-center border-b py-2 ps-2 pe-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-2" />
      <Link href="/" className="text-lg font-semibold">
        Task Manager
      </Link>
      <div className="ms-auto">
        <UserButton showName />
      </div>
    </header>
  );
}
