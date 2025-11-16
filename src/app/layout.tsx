import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import QCProvider from "./components/QCProvider";
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
  title: "Taskflow",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <SignedIn>
              <QCProvider>
                {children}
                <Toaster richColors />
              </QCProvider>
            </SignedIn>
            <SignedOut>
              {/* Unauthenticated users see LandingPage via page.tsx */}
              {children}
            </SignedOut>
          </ClerkProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
