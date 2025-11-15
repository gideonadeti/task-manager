"use client";

import { Task } from "@prisma/client";
import { useState } from "react";
import { isToday, isTomorrow, isPast } from "date-fns";
import { Calendar, Clock, CheckCircle2, Circle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddTask from "@/components/add-task";
import DeleteDialog from "@/components/delete-dialog";
import useGroups from "@/hooks/use-groups";
import formatDate from "../format-date";

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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              <span
                className={
                  task.completed ? "line-through text-muted-foreground" : ""
                }
              >
                {task.title}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
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
                  <p className={`text-sm ${getDueDateUrgency(task.dueDate)}`}>
                    {formatDate(new Date(task.dueDate))}
                  </p>
                </div>
              )}

              {group && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Group</h4>
                  <p className="text-sm text-muted-foreground">{group.name}</p>
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

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleEdit} className="flex-1">
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                Delete
              </Button>
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
