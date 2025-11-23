"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Flame, Sun, BarChart3 } from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isThisWeek,
} from "date-fns";
import { H2 } from "../../ui/CustomTags";
import { Task } from "@prisma/client";

interface ProductivityInsightsProps {
  tasks: Task[];
}

export function ProductivityInsights({ tasks }: ProductivityInsightsProps) {
  const insights = useMemo(() => {
    const completedThisWeek = tasks.filter((task) => {
      if (!task.completed || !task.updatedAt) return false;
      const updated = new Date(task.updatedAt);
      return isThisWeek(updated);
    }).length;

    // Calculate streak (simplified - days with at least one completion)
    const completionDates = new Set(
      tasks
        .filter((task) => task.completed && task.updatedAt)
        .map((task) => format(new Date(task.updatedAt!), "yyyy-MM-dd"))
    );
    const streak = completionDates.size;

    // Most productive day (simplified - just show this week's pattern)
    const weekDays = eachDayOfInterval({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date()),
    });
    const dayCounts = weekDays.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      return tasks.filter(
        (task) =>
          task.completed &&
          task.updatedAt &&
          format(new Date(task.updatedAt), "yyyy-MM-dd") === dayStr
      ).length;
    });
    const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const mostProductiveDay = format(weekDays[maxDayIndex], "EEEE");

    return {
      completedThisWeek,
      streak,
      mostProductiveDay,
    };
  }, [tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
      className="border rounded-lg p-4 sm:p-6 bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <H2 className="text-lg sm:text-xl">Productivity Insights</H2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">This Week</p>
            <p className="text-lg font-bold">{insights.completedThisWeek}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="text-lg font-bold">{insights.streak} days</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <Sun className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Most Active</p>
            <p className="text-lg font-bold">{insights.mostProductiveDay}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

