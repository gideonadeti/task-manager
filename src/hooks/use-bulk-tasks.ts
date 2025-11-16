import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Task } from "@prisma/client";
import {
  toggleComplete,
  updateTask,
  deleteTask,
} from "@/lib/api/query-functions";

interface UseBulkTasksProps {
  onSuccess?: () => void; // Callback to clear selection after success
}

const useBulkTasks = ({ onSuccess }: UseBulkTasksProps = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Bulk mark as complete mutation
  const bulkMarkCompleteMutation = useMutation({
    mutationFn: async (taskIds: string[]) => {
      // Get current task states
      const tasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];
      const tasksToUpdate = tasks.filter((t) => taskIds.includes(t.id));

      // Toggle all incomplete tasks to complete
      const incompleteTasks = tasksToUpdate.filter((t) => !t.completed);
      const promises = incompleteTasks.map((task) =>
        toggleComplete(task.id, task.completed)
      );

      await Promise.all(promises);
      return taskIds;
    },
    onMutate: async (taskIds) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((task) =>
          taskIds.includes(task.id) && !task.completed
            ? { ...task, completed: true }
            : task
        )
      );

      return { previousTasks };
    },
    onError: (error, taskIds, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }

      const description =
        error instanceof AxiosError && error.response
          ? (error.response.data as { error: string }).error ||
            "Something went wrong"
          : "Something went wrong";

      toast({ description, variant: "destructive" });
    },
    onSuccess: (taskIds) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onSuccess?.();
      toast({
        description: `${taskIds.length} task${
          taskIds.length === 1 ? "" : "s"
        } marked as complete`,
      });
    },
  });

  // Bulk update priority mutation
  const bulkUpdatePriorityMutation = useMutation({
    mutationFn: async ({
      taskIds,
      priority,
    }: {
      taskIds: string[];
      priority: string;
    }) => {
      const tasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];
      const tasksToUpdate = tasks.filter((t) => taskIds.includes(t.id));

      const promises = tasksToUpdate.map((task) =>
        updateTask(
          task.id,
          task.title,
          task.description || "",
          priority,
          task.groupId,
          task.dueDate || undefined
        )
      );

      await Promise.all(promises);
      return { taskIds, priority };
    },
    onMutate: async ({ taskIds, priority }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((task) =>
          taskIds.includes(task.id)
            ? { ...task, priority: priority as "low" | "medium" | "high" }
            : task
        )
      );

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }

      const description =
        error instanceof AxiosError && error.response
          ? (error.response.data as { error: string }).error ||
            "Something went wrong"
          : "Something went wrong";

      toast({ description, variant: "destructive" });
    },
    onSuccess: ({ taskIds, priority }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccess?.();
      toast({
        description: `Priority updated to ${priority} for ${
          taskIds.length
        } task${taskIds.length === 1 ? "" : "s"}`,
      });
    },
  });

  // Bulk update group mutation
  const bulkUpdateGroupMutation = useMutation({
    mutationFn: async ({
      taskIds,
      groupId,
    }: {
      taskIds: string[];
      groupId: string;
    }) => {
      const tasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];
      const tasksToUpdate = tasks.filter((t) => taskIds.includes(t.id));

      const promises = tasksToUpdate.map((task) =>
        updateTask(
          task.id,
          task.title,
          task.description || "",
          task.priority,
          groupId,
          task.dueDate || undefined
        )
      );

      await Promise.all(promises);
      return { taskIds, groupId };
    },
    onMutate: async ({ taskIds, groupId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((task) =>
          taskIds.includes(task.id) ? { ...task, groupId } : task
        )
      );

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }

      const description =
        error instanceof AxiosError && error.response
          ? (error.response.data as { error: string }).error ||
            "Something went wrong"
          : "Something went wrong";

      toast({ description, variant: "destructive" });
    },
    onSuccess: ({ taskIds }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccess?.();
      toast({
        description: `Moved ${taskIds.length} task${
          taskIds.length === 1 ? "" : "s"
        } to group`,
      });
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (taskIds: string[]) => {
      const promises = taskIds.map((id) => deleteTask(id));
      await Promise.all(promises);
      return taskIds;
    },
    onMutate: async (taskIds) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.filter((task) => !taskIds.includes(task.id))
      );

      return { previousTasks };
    },
    onError: (error, taskIds, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }

      const description =
        error instanceof AxiosError && error.response
          ? (error.response.data as { error: string }).error ||
            "Something went wrong"
          : "Something went wrong";

      toast({ description, variant: "destructive" });
    },
    onSuccess: (taskIds) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccess?.();
      toast({
        description: `${taskIds.length} task${
          taskIds.length === 1 ? "" : "s"
        } deleted`,
      });
    },
  });

  return {
    bulkMarkCompleteMutation,
    bulkUpdatePriorityMutation,
    bulkUpdateGroupMutation,
    bulkDeleteMutation,
  };
};

export default useBulkTasks;
