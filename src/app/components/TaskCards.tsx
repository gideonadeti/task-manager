"use client";

import { Task } from "@prisma/client";
import { isToday, isTomorrow, isPast } from "date-fns";
import { useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import TaskCompletionCheckbox from "./TaskCompletionCheckbox";
import TaskActions from "./TaskActions";
import TaskDetailsDialog from "./TaskDetailsDialog";
import formatDate from "../format-date";

interface TaskCardsProps {
  tasks: Task[];
}

export default function TaskCards({ tasks }: TaskCardsProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  const handleDetailsOpenChange = (open: boolean) => {
    setDetailsOpen(open);
    if (!open) {
      setSelectedTask(null);
    }
  };

  const getPriorityColor = (priority: string) => {
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

  const getDueDateUrgency = (dueDate: Date | null) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleCardClick(task)}
            className={`relative border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              task.completed
                ? "bg-muted/50 opacity-75"
                : "bg-card"
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
                    task.completed
                      ? "line-through text-muted-foreground"
                      : ""
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
            <div
              className="flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <TaskActions task={task} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`text-xs ${getPriorityColor(task.priority)}`}
              >
                {task.priority.charAt(0).toUpperCase() +
                  task.priority.slice(1)}
              </Badge>
              {task.dueDate && (
                <span
                  className={`text-xs ${getDueDateUrgency(task.dueDate)}`}
                >
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
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

