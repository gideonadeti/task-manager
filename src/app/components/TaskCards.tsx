"use client";

import { Task } from "@prisma/client";
import { isToday, isTomorrow, isPast } from "date-fns";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import TaskSelectionCheckbox from "./TaskSelectionCheckbox";
import TaskActions from "./TaskActions";
import formatDate from "../format-date";

// Dynamically import TaskDetailsDialog to reduce initial bundle size
const TaskDetailsDialog = dynamic(() => import("./TaskDetailsDialog"), {
  loading: () => null, // No loading indicator needed as it's only shown when task is selected
});

interface TaskCardsProps {
  tasks: Task[];
  selectedTaskIds: Set<string>;
  onSelectionChange: (taskId: string, checked: boolean) => void;
}

// Memoized priority color function using useMemo pattern
const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
    case "low":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  }
};

// Memoized due date urgency function
const getDueDateUrgency = (dueDate: Date | null, completed: boolean): string | null => {
  if (!dueDate) return null;

  // If task is completed, don't show red styling for overdue dates
  if (isPast(dueDate) && !isToday(dueDate)) {
    return completed ? "text-gray-600 dark:text-gray-400" : "text-red-600 dark:text-red-400 font-semibold";
  } else if (isToday(dueDate)) {
    return "text-orange-600 dark:text-orange-400 font-semibold";
  } else if (isTomorrow(dueDate)) {
    return "text-blue-600 dark:text-blue-400";
  }
  return "text-gray-600 dark:text-gray-400";
};

// TaskCard component
interface TaskCardProps {
  task: Task;
  onCardClick: (task: Task) => void;
  isSelected: boolean;
  onSelectionChange: (taskId: string, checked: boolean) => void;
}

function TaskCard({
  task,
  onCardClick,
  isSelected,
  onSelectionChange,
}: TaskCardProps) {
  const priorityColor = getPriorityColor(task.priority);
  const dueDateUrgency = getDueDateUrgency(task.dueDate, task.completed);

  // Check if due date should pulse (overdue or today, and not completed)
  const shouldPulse =
    task.dueDate &&
    !task.completed &&
    (isToday(task.dueDate) || (isPast(task.dueDate) && !isToday(task.dueDate)));

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if the click is not on the checkbox or actions area
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-selection-checkbox]") ||
      target.closest("[data-task-actions]")
    ) {
      return;
    }
    onCardClick(task);
  };

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: -20 },
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        y: { duration: 0.2 },
        layout: { duration: 0.3, ease: "easeInOut" },
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 },
      }}
      onClick={handleClick}
      className={`relative border rounded-lg p-3 sm:p-4 shadow-sm cursor-pointer ${
        task.completed ? "bg-muted/50" : "bg-card"
      }`}
      style={{
        boxShadow:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      }}
      onHoverStart={(e) => {
        const target = e.currentTarget as HTMLElement;
        if (target) {
          target.style.boxShadow =
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
        }
      }}
      onHoverEnd={(e) => {
        const target = e.currentTarget as HTMLElement;
        if (target) {
          target.style.boxShadow =
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)";
        }
      }}
    >
      <motion.div
        animate={{
          opacity: task.completed ? 0.75 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="flex items-start justify-between gap-2 mb-3"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="mt-1 flex-shrink-0"
            data-selection-checkbox
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <TaskSelectionCheckbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelectionChange(task.id, checked)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <motion.h3
              animate={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
              transition={{ duration: 0.3 }}
              className={`font-semibold text-base mb-1 line-clamp-1 ${
                task.completed ? "text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </motion.h3>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div
          className="flex-shrink-0"
          data-task-actions
          onClick={(e) => e.stopPropagation()}
        >
          <TaskActions task={task} />
        </div>
      </motion.div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority badge with smooth appearance */}
          <motion.div
            key={task.priority}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            layout
          >
            <Badge variant="outline" className={`text-xs ${priorityColor}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </motion.div>

          {/* Due date with smooth appearance */}
          {task.dueDate && (
            <motion.span
              key={task.dueDate.toString()}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`text-xs ${dueDateUrgency} ${
                shouldPulse ? "animate-pulse" : ""
              }`}
            >
              {formatDate(task.dueDate)}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TaskCards({
  tasks,
  selectedTaskIds,
  onSelectionChange,
}: TaskCardsProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleCardClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  }, []);

  const handleDetailsOpenChange = useCallback((open: boolean) => {
    setDetailsOpen(open);
    if (!open) {
      setSelectedTask(null);
    }
  }, []);

  if (tasks.length === 0) {
    return (
      <Empty className="h-64 border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>No tasks found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search or filter criteria
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 pb-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.1,
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <AnimatePresence mode="sync">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onCardClick={handleCardClick}
              isSelected={selectedTaskIds.has(task.id)}
              onSelectionChange={onSelectionChange}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      <TaskDetailsDialog
        task={selectedTask}
        open={detailsOpen}
        onOpenChange={handleDetailsOpenChange}
      />
    </>
  );
}

export default TaskCards;
