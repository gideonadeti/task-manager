import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import QCProvider from "./components/QCProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { InstallButton } from "@/components/install-button";
import {
  generateMetadata as generateSEOMetadata,
  generateStructuredData,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const seoMetadata = generateSEOMetadata();

export const metadata: Metadata = {
  ...seoMetadata,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Taskflow",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = generateStructuredData();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <QCProvider>
              <SignedIn>{children}</SignedIn>
              <SignedOut>{children}</SignedOut>
              <Toaster richColors />
              <InstallButton />
            </QCProvider>
          </ClerkProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
