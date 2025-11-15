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
import { hasAxiosResponse, isAxiosErrorResponse } from "@/lib/type-guards";

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
    }
  >({
    mutationFn: ({ title, description, priority, groupId, dueDate }) => {
      return createTask(title, description, priority, groupId, dueDate);
    },
    onError: (err) => {
      let description = "Something went wrong";

      if (hasAxiosResponse(err) && err.response?.data) {
        if (isAxiosErrorResponse(err.response.data)) {
          description = err.response.data.error;
        }
      }

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
      form: UseFormReturn<TaskFormData, TaskFormData, undefined>;
      setOpen: (open: boolean) => void;
    }
  >({
    mutationFn: ({ id, title, description, priority, groupId, dueDate }) => {
      return updateTask(id, title, description, priority, groupId, dueDate);
    },
    onError: (err) => {
      let description = "Something went wrong";

      if (hasAxiosResponse(err) && err.response?.data) {
        if (isAxiosErrorResponse(err.response.data)) {
          description = err.response.data.error;
        }
      }

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
      let description = "Something went wrong";

      if (hasAxiosResponse(err) && err.response?.data) {
        if (isAxiosErrorResponse(err.response.data)) {
          description = err.response.data.error;
        }
      }

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
    if (tasksQuery.isError && tasksQuery.error) {
      let description = "Something went wrong";

      if (
        hasAxiosResponse(tasksQuery.error) &&
        tasksQuery.error.response?.data
      ) {
        if (isAxiosErrorResponse(tasksQuery.error.response.data)) {
          description = tasksQuery.error.response.data.error;
        }
      }

      toast.error(description);
    }
  }, [tasksQuery.error, tasksQuery.isError]);

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    tasksQuery,
  };
};

export default useTasks;
