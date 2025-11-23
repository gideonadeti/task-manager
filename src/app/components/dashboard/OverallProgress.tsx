"use client";

import { motion, useReducedMotion } from "motion/react";
import { Target } from "lucide-react";

interface OverallProgressProps {
  completed: number;
  total: number;
}

export function OverallProgress({ completed, total }: OverallProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border rounded-lg p-4 sm:p-6 bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="size-5 text-primary" />
          <span className="font-semibold text-sm sm:text-base">
            Overall Progress
          </span>
        </div>
        <span className="text-lg sm:text-xl font-bold">{percentage}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5 sm:h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={reducedMotion ? {} : { width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <span>{completed} completed</span>
        <span>{total} total</span>
      </div>
    </motion.div>
  );
}

