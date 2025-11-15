"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Task } from "@prisma/client";

import { Button } from "@/components/ui/button";
import AddTask from "@/components/add-task";
import DeleteTask from "@/components/delete-task";
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

  function handleUpdate() {
    setTaskUpdate(task);
    setUpdateOpen(true);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleUpdate}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeleteOpen(true)}
          className="text-destructive bg-destructive/10"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AddTask task={taskUpdate} open={updateOpen} setOpen={setUpdateOpen} />
      <DeleteTask
        taskDeleteId={task.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </DropdownMenu>
  );
}
