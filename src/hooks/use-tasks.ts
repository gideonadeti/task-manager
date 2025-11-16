import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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
  const params = useParams();
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
    { id: string; onOpenChange: (open: boolean) => void },
    {
      previousTasks: Task[] | undefined;
    }
  >({
    mutationFn: ({ id }) => {
      return deleteTask(id);
    },
    onMutate: async ({ id, onOpenChange }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.filter((task) => task.id !== id)
      );

      // Close dialog immediately
      onOpenChange(false);

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      // Reopen dialog on error
      variables.onOpenChange(true);
      handleApiError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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

  const updateTaskPriorityMutation = useMutation<
    Task,
    AxiosError,
    { taskId: string; priority: string },
    {
      previousTasks: Task[] | undefined;
    }
  >({
    mutationFn: async ({ taskId, priority }) => {
      const tasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      return updateTask(
        task.id,
        task.title,
        task.description || "",
        priority,
        task.groupId,
        task.dueDate || undefined
      );
    },
    onMutate: async ({ taskId, priority }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((t) =>
          t.id === taskId
            ? { ...t, priority: priority as "low" | "medium" | "high" }
            : t
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
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) =>
        prevTasks?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    },
  });

  const updateTaskGroupMutation = useMutation<
    Task,
    AxiosError,
    { taskId: string; groupId: string },
    {
      previousTasks: Task[] | undefined;
    }
  >({
    mutationFn: async ({ taskId, groupId }) => {
      const tasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      return updateTask(
        task.id,
        task.title,
        task.description || "",
        task.priority,
        groupId,
        task.dueDate || undefined
      );
    },
    onMutate: async ({ taskId, groupId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((t) => (t.id === taskId ? { ...t, groupId } : t))
      );

      // Navigate immediately to the new group if it's different from current
      const currentGroupId = params?.groupId as string | undefined;
      const groups = queryClient.getQueryData<Group[]>(["groups"]);
      const newGroup = groups?.find((g) => g.id === groupId);
      const isInboxGroup = newGroup?.name === "Inbox";
      const targetGroupId = isInboxGroup ? "inbox" : groupId;

      const specialViews = [
        "today",
        "tomorrow",
        "this-week",
        "overdue",
        "completed",
      ];
      const isSpecialView = currentGroupId
        ? specialViews.includes(currentGroupId)
        : false;

      if (
        isSpecialView ||
        !currentGroupId ||
        currentGroupId !== targetGroupId
      ) {
        router.push(`/groups/${targetGroupId}`);
      }

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      handleApiError(error);
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) =>
        prevTasks?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    },
  });

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    toggleTaskCompletionMutation,
    updateTaskPriorityMutation,
    updateTaskGroupMutation,
    tasksQuery,
  };
};

export default useTasks;
