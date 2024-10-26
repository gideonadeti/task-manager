import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <header className="flex items-center border-b py-2 ps-1 pe-4">
      <SidebarTrigger />
      <span className="me-2 border-l h-6"></span>
      <Link href="/" className="text-lg font-semibold">
        Task Manager
      </Link>
      <div className="ms-auto">
        <UserButton showName />
      </div>
    </header>
  );
}
