import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex items-center border-b py-2 px-4">
      <Link href="/" className="text-lg font-semibold">
        Task Manager
      </Link>
      <div className="ms-auto">
        <UserButton showName />
      </div>
    </header>
  );
}
