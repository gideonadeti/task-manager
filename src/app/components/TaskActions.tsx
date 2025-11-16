"use client";

import {
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Pencil,
  Tag,
  FolderInput,
} from "lucide-react";
import { useState } from "react";
import { Task } from "@prisma/client";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import useTasks from "@/hooks/use-tasks";

// Dynamically import heavy dialog components to reduce initial bundle size
const AddTask = dynamic(() => import("@/components/add-task"), {
  loading: () => null, // No loading indicator needed as it's only shown when dialog is open
});

const DeleteDialog = dynamic(() => import("@/components/delete-dialog"), {
  loading: () => null, // No loading indicator needed as it's only shown when dialog is open
});

const BulkPriorityDialog = dynamic(
  () => import("@/app/components/BulkPriorityDialog"),
  {
    loading: () => null,
  }
);

const BulkGroupDialog = dynamic(
  () => import("@/app/components/BulkGroupDialog"),
  {
    loading: () => null,
  }
);

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface TaskActionsProps {
  task: Task;
}

export default function TaskActions({ task }: TaskActionsProps) {
  const [taskUpdate, setTaskUpdate] = useState<Task | undefined>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const {
    toggleTaskCompletionMutation,
    updateTaskPriorityMutation,
    updateTaskGroupMutation,
  } = useTasks();

  function handleUpdate() {
    setTaskUpdate(task);
    setUpdateOpen(true);
  }

  function handleToggleCompletion() {
    toggleTaskCompletionMutation.mutate({
      taskId: task.id,
      previousStatus: task.completed,
    });
  }

  function handlePriorityChange(priority: string) {
    updateTaskPriorityMutation.mutate({
      taskId: task.id,
      priority,
    });
  }

  function handleGroupChange(groupId: string) {
    updateTaskGroupMutation.mutate({
      taskId: task.id,
      groupId,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 p-0"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleToggleCompletion}>
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
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPriorityOpen(true)}>
          <Tag className="mr-2 h-4 w-4" />
          Change Priority
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setGroupOpen(true)}>
          <FolderInput className="mr-2 h-4 w-4" />
          Move to Group
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleUpdate}>
          <Pencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeleteOpen(true)}
          className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AddTask task={taskUpdate} open={updateOpen} setOpen={setUpdateOpen} />
      <BulkPriorityDialog
        open={priorityOpen}
        onOpenChange={setPriorityOpen}
        onSelectPriority={handlePriorityChange}
      />
      <BulkGroupDialog
        open={groupOpen}
        onOpenChange={setGroupOpen}
        onSelectGroup={handleGroupChange}
      />
      <DeleteDialog
        type="task"
        deleteId={task.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </DropdownMenu>
  );
}
