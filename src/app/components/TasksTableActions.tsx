"use client";

import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { Task } from "@prisma/client";

import { Button } from "@/components/ui/button";
import AddTask from "@/components/add-task";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface TasksTableActionsProps<TData> {
  row: Row<TData>;
}

export default function TasksTableActions<TData extends Task>({
  row,
}: TasksTableActionsProps<TData>) {
  const task = row.original;
  const [taskUpdate, setTaskUpdate] = useState<TData | undefined>();
  const [updateOpen, setUpdateOpen] = useState(false);

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
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>

      <AddTask task={taskUpdate} open={updateOpen} setOpen={setUpdateOpen} />
    </DropdownMenu>
  );
}
