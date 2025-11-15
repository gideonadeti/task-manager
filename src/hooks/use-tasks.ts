import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

import {
  createTask,
  readTasks,
  updateTask,
  deleteTask,
} from "@/lib/api/query-functions";
import { UseFormReturn } from "react-hook-form";
import { Task } from "@prisma/client";

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
      form: UseFormReturn<
        {
          title: string;
          description: string;
          priority: string;
          groupId: string;
          dueDate?: Date;
        },
        unknown,
        undefined
      >;
      setOpen: (open: boolean) => void;
    }
  >({
    mutationFn: ({ title, description, priority, groupId, dueDate }) => {
      return createTask(title, description, priority, groupId, dueDate);
    },
    onError: (err) => {
      const description =
        (err?.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (createdTask, { form, setOpen }) => {
      setOpen(false);

      toast.success("Task created successfully");
      form.reset();
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) => {
        return [createdTask, ...(prevTasks || [])];
      });
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
      form: UseFormReturn<
        {
          title: string;
          description: string;
          priority: string;
          groupId: string;
          dueDate?: Date | undefined;
        },
        unknown,
        undefined
      >;
      setOpen: (open: boolean) => void;
    }
  >({
    mutationFn: ({ id, title, description, priority, groupId, dueDate }) => {
      return updateTask(id, title, description, priority, groupId, dueDate);
    },
    onError: (err) => {
      const description =
        (err?.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast.error(description);
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
      const description =
        (err?.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (deletedTask, { onOpenChange }) => {
      onOpenChange(false);

      toast.success("Task deleted successfully");
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) => {
        return prevTasks?.filter((task) => task.id !== deletedTask.id);
      });
    },
  });

  const tasksQuery = useQuery<Task[], AxiosError>({
    queryKey: ["tasks"],
    queryFn: () => readTasks(),
  });

  // Error handling effect
  useEffect(() => {
    if (tasksQuery.isError) {
      const description =
        (tasksQuery.error?.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast.error(description);
    }
  }, [tasksQuery.error?.response?.data, tasksQuery.isError]);

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    tasksQuery,
  };
};

export default useTasks;
