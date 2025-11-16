import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import {
  createTask,
  readTasks,
  updateTask,
  deleteTask,
  toggleComplete,
} from "@/lib/api/query-functions";
import { UseFormReturn } from "react-hook-form";
import { Task } from "@prisma/client";
import { handleApiError } from "@/lib/api/error-handler";
import { ExtendedGroup } from "@/types";

type TaskFormData = {
  title: string;
  description: string;
  priority: string;
  groupId: string;
  dueDate?: Date;
};

const useTasks = () => {
  const queryClient = useQueryClient();
  const createTaskMutation = useMutation<
    Task,
    AxiosError,
    {
      title: string;
      description: string;
      priority: string;
      groupId: string;
      dueDate?: Date;
      form: UseFormReturn<TaskFormData, TaskFormData, undefined>;
      setOpen: (open: boolean) => void;
      router?: AppRouterInstance;
      currentGroupId?: string;
      groups?: Array<{ id: string; name: string }>;
    }
  >({
    mutationFn: ({ title, description, priority, groupId, dueDate }) => {
      return createTask(title, description, priority, groupId, dueDate);
    },
    onError: (err) => {
      handleApiError(err);
    },
    onSuccess: (
      createdTask,
      { form, setOpen, router, currentGroupId, groups }
    ) => {
      setOpen(false);

      toast.success("Task created successfully");
      form.reset();
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) => {
        return [createdTask, ...(prevTasks || [])];
      });

      // Navigate to the task's group if it's different from the current one
      if (router && currentGroupId && groups) {
        const taskGroup = groups.find((g) => g.id === createdTask.groupId);
        const isInboxGroup = taskGroup?.name === "Inbox";
        const targetGroupId = isInboxGroup ? "inbox" : createdTask.groupId;

        // Only redirect if we're not already on that group's page
        if (currentGroupId !== targetGroupId) {
          router.push(`/groups/${targetGroupId}`);
        }
      }
    },
  });

  const updateTaskMutation = useMutation<
    Task,
    AxiosError,
    {
      id: string;
      title: string;
      description: string;
      priority: string;
      groupId: string;
      dueDate?: Date;
      form: UseFormReturn<TaskFormData, TaskFormData, undefined>;
      setOpen: (open: boolean) => void;
    }
  >({
    mutationFn: ({ id, title, description, priority, groupId, dueDate }) => {
      return updateTask(id, title, description, priority, groupId, dueDate);
    },
    onError: (err) => {
      handleApiError(err);
    },
    onSuccess: (updatedTask, { form, setOpen }) => {
      setOpen(false);

      toast.success("Task updated successfully");
      form.reset();
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) => {
        return prevTasks?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      });
    },
  });

  const deleteTaskMutation = useMutation<
    Task,
    AxiosError,
    { id: string; onOpenChange: (open: boolean) => void }
  >({
    mutationFn: ({ id }) => {
      return deleteTask(id);
    },
    onError: (err) => {
      // Error is already handled by React Query and shown via toast
      // Logging here for debugging purposes
      handleApiError(err);
    },
    onSuccess: (deletedTask, { onOpenChange }) => {
      onOpenChange(false);

      toast.success("Task deleted successfully");
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) => {
        return prevTasks?.filter((task) => task.id !== deletedTask.id);
      });
    },
  });

  const toggleTaskCompletionMutation = useMutation<
    string,
    AxiosError,
    { taskId: string; previousStatus: boolean },
    {
      previousTasks: Task[] | undefined;
      previousGroups: ExtendedGroup[] | undefined;
    }
  >({
    mutationFn: ({ taskId, previousStatus }) => {
      return toggleComplete(taskId, previousStatus);
    },
    onMutate: async ({ taskId, previousStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      await queryClient.cancelQueries({ queryKey: ["groups"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      const previousGroups = queryClient.getQueryData<ExtendedGroup[]>([
        "groups",
      ]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((t) =>
          t.id === taskId ? { ...t, completed: !previousStatus } : t
        )
      );

      queryClient.setQueryData<ExtendedGroup[]>(["groups"], (oldGroups) =>
        oldGroups?.map((group) =>
          group.tasks.some((t) => t.id === taskId)
            ? {
                ...group,
                tasks: group.tasks.map((t) =>
                  t.id === taskId ? { ...t, completed: !previousStatus } : t
                ),
              }
            : group
        )
      );

      return { previousTasks, previousGroups };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
        queryClient.setQueryData(["groups"], context.previousGroups);
      }
      handleApiError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const tasksQuery = useQuery<Task[], AxiosError>({
    queryKey: ["tasks"],
    queryFn: () => readTasks(),
  });

  // Error handling effect
  useEffect(() => {
    if (tasksQuery.isError && tasksQuery.error) {
      handleApiError(tasksQuery.error);
    }
  }, [tasksQuery.error, tasksQuery.isError]);

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    toggleTaskCompletionMutation,
    tasksQuery,
  };
};

export default useTasks;
