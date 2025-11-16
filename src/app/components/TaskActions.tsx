"use client";

import { MoreHorizontal, CheckCircle2, Circle, Pencil } from "lucide-react";
import { useState } from "react";
import { Task } from "@prisma/client";
import dynamic from "next/dynamic";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { toggleComplete } from "@/lib/api/query-functions";
import { ExtendedGroup } from "@/types";

// Dynamically import heavy dialog components to reduce initial bundle size
const AddTask = dynamic(() => import("@/components/add-task"), {
  loading: () => null, // No loading indicator needed as it's only shown when dialog is open
});

const DeleteDialog = dynamic(() => import("@/components/delete-dialog"), {
  loading: () => null, // No loading indicator needed as it's only shown when dialog is open
});
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
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: toggleCompletion } = useMutation({
    mutationFn: (previousStatus: boolean) =>
      toggleComplete(task.id, previousStatus),

    onMutate: async (previousStatus) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      await queryClient.cancelQueries({ queryKey: ["groups"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      const previousGroups = queryClient.getQueryData<ExtendedGroup[]>([
        "groups",
      ]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((t) =>
          t.id === task.id ? { ...t, completed: !previousStatus } : t
        )
      );

      queryClient.setQueryData<ExtendedGroup[]>(["groups"], (oldGroups) =>
        oldGroups?.map((group) =>
          group.tasks.some((t) => t.id === task.id)
            ? {
                ...group,
                tasks: group.tasks.map((t) =>
                  t.id === task.id ? { ...t, completed: !previousStatus } : t
                ),
              }
            : group
        )
      );

      return { previousTasks, previousGroups };
    },
    onError: (error, previousStatus, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
        queryClient.setQueryData(["groups"], context.previousGroups);
      }

      const description =
        error instanceof AxiosError && error.response
          ? (error.response.data as { error: string }).error ||
            "Something went wrong"
          : "Something went wrong";

      toast({ description, variant: "destructive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  function handleUpdate() {
    setTaskUpdate(task);
    setUpdateOpen(true);
  }

  function handleToggleCompletion() {
    toggleCompletion(task.completed);
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
      <DeleteDialog
        type="task"
        deleteId={task.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </DropdownMenu>
  );
}
