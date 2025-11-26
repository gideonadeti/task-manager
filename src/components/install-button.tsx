"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone: boolean }).standalone ===
        true;
    setIsInstalled(isStandaloneMode);

    // Check if user dismissed it
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSinceDismissed =
        (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setIsDismissed(true);
      }
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
    setIsDismissed(true);
  };

  // Don't show if already installed, dismissed, or no prompt available
  if (isInstalled || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <Card className="w-[320px] shadow-lg">
        <CardContent className="p-4">
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>

          <div className="pr-6 space-y-2">
            <h3 className="text-sm font-semibold">Install Taskflow</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Install for quick access from your home screen
            </p>
            <Button onClick={handleInstall} size="sm" className="w-full">
              <Download className="size-3.5" />
              Install
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
