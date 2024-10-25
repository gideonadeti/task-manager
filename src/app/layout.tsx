import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

import "./globals.css";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col overflow-hidden h-screen`}
      >
        <ClerkProvider>
          <SignedIn>{children}</SignedIn>
          <SignedOut>
            <div className="flex-grow flex justify-between items-center">
              <div className="flex flex-col">
                <h3>Welcome to Task Manager</h3>
                <p>A web app for managing tasks.</p>
              </div>
              <SignIn />
            </div>
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
}
