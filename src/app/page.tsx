import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  // Only redirect if user is authenticated
  // Unauthenticated users will see the sign-in page via layout's <SignedOut>
  if (userId) {
    redirect("/groups/today");
  }

  // Return null for unauthenticated users - layout will show sign-in page
  return null;
}
