import useTasks from "@/hooks/use-tasks";
import useGroups from "./use-groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Task } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  toggleComplete,
  updateTask,
  deleteTask,
} from "@/lib/api/query-functions";

const useBulkTasks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { tasksQuery } = useTasks();
  const { groupsQuery } = useGroups();
  const groups = useMemo(() => groupsQuery.data || [], [groupsQuery.data]);

  // Bulk toggle completion mutation (marks complete if incomplete, marks incomplete if complete)
  const bulkMarkCompleteMutation = useMutation({
    mutationFn: async (taskIds: string[]) => {
      // Get current task states from tasksQuery
      const tasks = tasksQuery.data || [];
      const tasksToUpdate = tasks.filter((t) => taskIds.includes(t.id));

      if (tasksToUpdate.length === 0) {
        return { taskIds, markedComplete: false, count: 0 };
      }

      // Toggle each task based on its current state
      const promises = tasksToUpdate.map((task) =>
        toggleComplete(task.id, task.completed)
      );

      await Promise.all(promises);

      // Determine action: if any task was incomplete, we marked them complete
      // Otherwise, we marked them incomplete
      const allWereIncomplete = tasksToUpdate.every((t) => !t.completed);
      const markedComplete = allWereIncomplete;

      return { taskIds, markedComplete, count: tasksToUpdate.length };
    },
    onMutate: async (taskIds) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      const tasks = tasksQuery.data || [];

      // Toggle each selected task's completion state
      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((task) => {
          if (taskIds.includes(task.id)) {
            const currentTask = tasks.find((t) => t.id === task.id);
            // Toggle based on current state from tasksQuery
            return {
              ...task,
              completed: currentTask ? !currentTask.completed : !task.completed,
            };
          }
          return task;
        })
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
    onMutate: async ({ taskIds, groupId: newGroupId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((task) =>
          taskIds.includes(task.id) ? { ...task, groupId: newGroupId } : task
        )
      );

      // Navigate immediately to the new group if it's different from current
      const currentGroupId = params?.groupId as string | undefined;

      // Get groups to check if it's an Inbox group
      const newGroup = groups.find((g) => g.id === newGroupId);
      const isInboxGroup = newGroup?.name === "Inbox";
      const targetGroupId = isInboxGroup ? "inbox" : newGroupId;

      // Special views that don't correspond to actual groups
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

      // Redirect to the new group if:
      // 1. We're on a special view (always redirect when moving to a real group)
      // 2. The current group is different from the target group
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

      const description =
        error instanceof AxiosError && error.response
          ? (error.response.data as { error: string }).error ||
            "Something went wrong"
          : "Something went wrong";

      toast({ description, variant: "destructive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (taskIds: string[]) => {
      const promises = taskIds.map((id) => deleteTask(id));
      await Promise.all(promises);
      return taskIds;
    },
    onError: (error) => {
      const description =
        error instanceof AxiosError && error.response
          ? (error.response.data as { error: string }).error ||
            "Something went wrong"
          : "Something went wrong";

      toast({ description, variant: "destructive" });
    },
    onSuccess: (taskIds) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
