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
import TaskCompletionCheckbox from "./TaskCompletionCheckbox";
import TaskActions from "./TaskActions";
import formatDate from "../format-date";

// Dynamically import TaskDetailsDialog to reduce initial bundle size
const TaskDetailsDialog = dynamic(() => import("./TaskDetailsDialog"), {
  loading: () => null, // No loading indicator needed as it's only shown when task is selected
});

interface TaskCardsProps {
  tasks: Task[];
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
const getDueDateUrgency = (dueDate: Date | null): string | null => {
  if (!dueDate) return null;

  if (isPast(dueDate) && !isToday(dueDate)) {
    return "text-red-600 dark:text-red-400 font-semibold";
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
}

function TaskCard({ task, onCardClick }: TaskCardProps) {
  const priorityColor = getPriorityColor(task.priority);
  const dueDateUrgency = getDueDateUrgency(task.dueDate);

  const handleClick = () => {
    onCardClick(task);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative border rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        task.completed ? "bg-muted/50 opacity-75" : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="mt-1 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <TaskCompletionCheckbox
              taskId={task.id}
              completed={task.completed}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base mb-1 line-clamp-1 ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <TaskActions task={task} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={`text-xs ${priorityColor}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          {task.dueDate && (
            <span className={`text-xs ${dueDateUrgency}`}>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskCards({ tasks }: TaskCardsProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 pb-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onCardClick={handleCardClick} />
        ))}
      </div>
      <TaskDetailsDialog
        task={selectedTask}
        open={detailsOpen}
        onOpenChange={handleDetailsOpenChange}
      />
    </>
  );
}

export default TaskCards;
