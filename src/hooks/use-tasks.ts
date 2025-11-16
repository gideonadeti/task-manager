import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  createTask,
  readTasks,
  updateTask,
  deleteTask,
  toggleComplete,
} from "@/lib/api/query-functions";
import { Task, Group } from "@prisma/client";
import { handleApiError } from "@/lib/api/error-handler";
import { formSchema } from "@/components/add-task";

const useTasks = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const createTaskMutation = useMutation<
    Task,
    AxiosError,
    {
      formValues: z.infer<typeof formSchema>;
      onOpenChange: (open: boolean) => void;
    }
  >({
    mutationFn: ({ formValues }) => {
      const { title, description, priority, groupId, dueDate } = formValues;
      return createTask(title, description, priority, groupId, dueDate);
    },
    onError: (err) => {
      handleApiError(err);
    },
    onSuccess: (createdTask, { onOpenChange }) => {
      onOpenChange(false);

      toast.success("Task created successfully");
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) => {
        return [createdTask, ...(prevTasks || [])];
      });

      // Navigate to the task's group
      const groups = queryClient.getQueryData<Group[]>(["groups"]);
      const taskGroup = groups?.find((g) => g.id === createdTask.groupId);
      const isInboxGroup = taskGroup?.name === "Inbox";
      const targetGroupId = isInboxGroup ? "inbox" : createdTask.groupId;
      router.push(`/groups/${targetGroupId}`);
    },
  });

  const updateTaskMutation = useMutation<
    Task,
    AxiosError,
    {
      id: string;
      formValues: z.infer<typeof formSchema>;
      onOpenChange: (open: boolean) => void;
    }
  >({
    mutationFn: ({ id, formValues }) => {
      const { title, description, priority, groupId, dueDate } = formValues;
      return updateTask(id, title, description, priority, groupId, dueDate);
    },
    onError: (err) => {
      handleApiError(err);
    },
    onSuccess: (updatedTask, { onOpenChange }) => {
      onOpenChange(false);

      toast.success("Task updated successfully");
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) => {
        return prevTasks?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      });

      // Navigate to the task's group
      const groups = queryClient.getQueryData<Group[]>(["groups"]);
      const taskGroup = groups?.find((g) => g.id === updatedTask.groupId);
      const isInboxGroup = taskGroup?.name === "Inbox";
      const targetGroupId = isInboxGroup ? "inbox" : updatedTask.groupId;
      router.push(`/groups/${targetGroupId}`);
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
    }
  >({
    mutationFn: ({ taskId, previousStatus }) => {
      return toggleComplete(taskId, previousStatus);
    },
    onMutate: async ({ taskId, previousStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((t) =>
          t.id === taskId ? { ...t, completed: !previousStatus } : t
        )
      );

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      handleApiError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    toggleTaskCompletionMutation,
    tasksQuery,
  };
};

export default useTasks;
