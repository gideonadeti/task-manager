"use client";

import { motion } from "motion/react";
import { Clock, Edit } from "lucide-react";
import { isToday, isPast } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import formatRelativeTime from "../../format-relative-time";
import { Task } from "@prisma/client";

interface TaskCardProps {
  task: Task;
  groups: Array<{ id: string; name: string }>;
  index: number;
  onTaskClick: (task: Task) => void;
}

export function TaskCard({ task, groups, index, onTaskClick }: TaskCardProps) {
  const group = groups.find((g) => g.id === task.groupId);
  const isOverdue =
    task.dueDate &&
    isPast(new Date(task.dueDate)) &&
    !isToday(new Date(task.dueDate)) &&
    !task.completed;

  // Generate color from group name (deterministic)
  const getGroupColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
      "bg-teal-500",
      "bg-green-500",
      "bg-amber-500",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTaskClick(task);
    }
  };

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.6 + index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="group relative"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onTaskClick(task)}
        onKeyDown={handleKeyDown}
        className={`border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-all cursor-pointer min-h-[88px] sm:min-h-[100px] ${
          isOverdue ? "border-red-500/50 dark:border-red-400/50" : ""
        } ${isOverdue && !task.completed ? "animate-pulse" : ""}`}
        aria-label={`Task: ${task.title}`}
      >
        {/* Priority indicator bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
            priorityColors[task.priority]
          }`}
        />
        {/* Group color stripe */}
        {group && (
          <div
            className={`absolute top-0 right-0 w-1 h-full ${getGroupColor(
              group.name
            )} opacity-30`}
          />
        )}
        <div className="ml-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base flex-1 mb-1 line-clamp-1">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {group && (
                <Badge
                  variant="outline"
                  className="text-xs hidden sm:inline-flex"
                >
                  {group.name}
                </Badge>
              )}
              <Badge
                variant="outline"
                className={`text-xs ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                    : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                }`}
              >
                {task.priority}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span
                  className={
                    isOverdue
                      ? "text-red-600 dark:text-red-400 font-semibold"
                      : isToday(new Date(task.dueDate))
                      ? "text-orange-600 dark:text-orange-400 font-semibold"
                      : "text-muted-foreground"
                  }
                >
                  {formatRelativeTime(task.dueDate)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick(task);
                }}
                aria-label="View task details"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

