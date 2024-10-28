import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { H1, H3 } from "./ui/CustomTags";
import QCProvider from "./components/QCProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A web app for managing tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClerkProvider>
          <SignedIn>
            <QCProvider>
              {children}
              <Toaster />
            </QCProvider>
          </SignedIn>
          <SignedOut>
            <div className="flex flex-col md:flex-row items-center justify-around gap-8 h-screen overflow-y-auto p-8">
              <div className="flex flex-col text-center lg:text-left">
                <H1>Welcome to Task Manager</H1>
                <H3>A web app for managing tasks.</H3>
              </div>
              <div className="flex items-center justify-center">
                <SignIn />
              </div>
            </div>
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
}
