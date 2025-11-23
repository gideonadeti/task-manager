"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProgressRing } from "./ProgressRing";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay?: number;
  percentage?: number;
  trend?: number;
  total?: number;
  tooltip?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
  percentage,
  trend,
  total,
  tooltip,
}: StatCardProps) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    const stepDuration = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [value, reducedMotion]);

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="border rounded-lg p-4 sm:p-6 bg-card/50 backdrop-blur-sm hover:bg-card transition-all shadow-sm hover:shadow-md relative overflow-hidden group"
    >
      {/* Gradient background */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${
          color.split(" ")[0]
        }`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${color} shadow-sm`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="flex items-center gap-2">
            {trend !== undefined && trend !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  trend > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
            {percentage !== undefined && (
              <div className="relative">
                <ProgressRing
                  percentage={percentage}
                  size={48}
                  strokeWidth={4}
                  color={
                    color.includes("blue")
                      ? "#3b82f6"
                      : color.includes("yellow")
                      ? "#eab308"
                      : color.includes("red")
                      ? "#ef4444"
                      : "#22c55e"
                  }
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                  {percentage}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-bold">{displayValue}</span>
          {total !== undefined && (
            <span className="text-sm text-muted-foreground">/ {total}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </motion.div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
}

