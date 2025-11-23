import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Home",
  description:
    "Streamline your workflow with Taskflow - a modern task management application. Organize tasks into groups, set priorities, track due dates, and boost your productivity. Get started for free today.",
  path: "/",
});

export default async function Home() {
  const { userId } = await auth();

  // Show dashboard for authenticated users, landing page for unauthenticated
  if (userId) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
