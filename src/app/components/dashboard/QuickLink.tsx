"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuickLinkProps {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  delay?: number;
}

export function QuickLink({
  href,
  title,
  icon: Icon,
  count,
  delay = 0,
}: QuickLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Link href={href}>
        <Button
          variant="outline"
          className="w-full justify-between h-auto p-4 hover:bg-accent transition-colors focus-visible:ring-2"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {count !== undefined && count > 0 && (
              <Badge variant="secondary" className="text-xs">
                {count}
              </Badge>
            )}
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </Link>
    </motion.div>
  );
}

