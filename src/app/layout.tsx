import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

import "./globals.css";
import QCProvider from "./components/QCProvider";
import { H1, H3 } from "./ui/CustomTags";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
              <Toaster />
            </QCProvider>
          </SignedIn>
          <SignedOut>
            <div className="max-w-4xl mx-auto flex flex-col min-h-screen">
              <H3 className="px-4 py-2">Task Manager</H3>
              <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 p-8">
                <div className="flex-1 flex flex-col text-center lg:text-left">
                  <H1>Organize Your Life, One Task at a Time</H1>
                  <p className="text-muted-foreground font-semibold text-lg">
                    A simple, intuitive task manager that keeps you on track and
                    boosts productivity.
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <SignIn />
                </div>
              </div>
            </div>
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
}
