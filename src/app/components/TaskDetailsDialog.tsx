"use client";

import { Task } from "@prisma/client";
import { useState } from "react";
import { isToday, isTomorrow, isPast } from "date-fns";
import { Calendar, Clock, CheckCircle2, Circle, Tag } from "lucide-react";
import dynamic from "next/dynamic";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGroups from "@/hooks/use-groups";
import { toggleComplete } from "@/lib/api/query-functions";
import formatDate from "../format-date";

// Dynamically import heavy dialog components to reduce initial bundle size
const AddTask = dynamic(() => import("@/components/add-task"), {
  loading: () => null, // No loading indicator needed as it's only shown when dialog is open
});

const DeleteDialog = dynamic(() => import("@/components/delete-dialog"), {
  loading: () => null, // No loading indicator needed as it's only shown when dialog is open
});

interface TaskDetailsDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDetailsDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailsDialogProps) {
  const { groupsQuery } = useGroups();
  const [taskUpdate, setTaskUpdate] = useState<Task | undefined>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: toggleCompletion } = useMutation({
    mutationFn: (previousStatus: boolean) => {
      if (!task) throw new Error("Task is not available");
      return toggleComplete(task.id, previousStatus);
    },

    onMutate: async (previousStatus) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      if (!task) return { previousTasks };

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((t) =>
          t.id === task.id ? { ...t, completed: !previousStatus } : t
        )
      );

      return { previousTasks };
    },
    onError: (error, previousStatus, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }

      const description =
        error instanceof AxiosError && error.response
          ? (error.response.data as { error: string }).error ||
            "Something went wrong"
          : "Something went wrong";

      toast.error(description, { id: "toggle-completion-error" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  function handleToggleCompletion() {
    if (!task) return;
    toggleCompletion(task.completed);
  }

  if (!task) return null;

  const group = groupsQuery.data?.find((g) => g.id === task.groupId);

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

  const getDueDateUrgency = (dueDate: Date | string | null) => {
    if (!dueDate) return "text-gray-600 dark:text-gray-400";

    const date = dueDate instanceof Date ? dueDate : new Date(dueDate);

    if (isPast(date) && !isToday(date)) {
      return "text-red-600 dark:text-red-400 font-semibold";
    } else if (isToday(date)) {
      return "text-orange-600 dark:text-orange-400 font-semibold";
    } else if (isTomorrow(date)) {
      return "text-blue-600 dark:text-blue-400";
    }
    return "text-gray-600 dark:text-gray-400";
  };

  function handleEdit() {
    if (!task) return;
    setTaskUpdate(task);
    setUpdateOpen(true);
  }

  function handleDelete() {
    setDeleteOpen(true);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0">
            <DialogTitle>
              <span
                className={
                  task.completed ? "line-through text-muted-foreground" : ""
                }
              >
                {task.title}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable content */}
          <ScrollArea className="h-[68vh] px-4 sm:px-6">
            <div className="space-y-4 pr-4">
              {task.description && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Priority
                  </h4>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </Badge>
                </div>

                {task.dueDate && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Due Date
                    </h4>
                    <p
                      className={`text-sm ${getDueDateUrgency(task.dueDate)} ${
                        !task.completed &&
                        task.dueDate &&
                        (isToday(new Date(task.dueDate)) ||
                          (isPast(new Date(task.dueDate)) &&
                            !isToday(new Date(task.dueDate))))
                          ? "animate-pulse"
                          : ""
                      }`}
                    >
                      {formatDate(new Date(task.dueDate))}
                    </p>
                  </div>
                )}

                {group && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Group</h4>
                    <p className="text-sm text-muted-foreground">
                      {group.name}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Status
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {task.completed ? "Completed" : "In Progress"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div>
                  <h4 className="text-sm font-medium mb-1">Created</h4>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(new Date(task.createdAt))}
                  </p>
                </div>
                {task.updatedAt &&
                  new Date(task.updatedAt).getTime() !==
                    new Date(task.createdAt).getTime() && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Last Updated</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(task.updatedAt))}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </ScrollArea>

          {/* Fixed footer with action buttons */}
          <div className="flex-shrink-0 border-t px-4 sm:px-6 py-3 sm:py-4 mt-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant={task.completed ? "outline" : "default"}
                onClick={handleToggleCompletion}
                className="w-full sm:flex-1 h-11 sm:h-10 min-h-[44px] sm:min-h-0"
              >
                {task.completed ? (
                  <>
                    <Circle className="mr-2 h-4 w-4" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </>
                )}
              </Button>
              <div className="flex gap-2 w-full sm:flex-1">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="flex-1 h-11 sm:h-10 min-h-[44px] sm:min-h-0"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1 h-11 sm:h-10 min-h-[44px] sm:min-h-0"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddTask task={taskUpdate} open={updateOpen} setOpen={setUpdateOpen} />
      <DeleteDialog
        type="task"
        deleteId={task.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
