import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Task } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useCallback } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { toggleComplete } from "@/lib/api/query-functions";

type TaskCompletionCheckboxProps = {
  taskId: string;
  completed: boolean;
};

function TaskCompletionCheckbox({
  taskId,
  completed,
}: TaskCompletionCheckboxProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate } = useMutation({
    mutationFn: (previousStatus: boolean) =>
      toggleComplete(taskId, previousStatus),

    onMutate: async (previousStatus) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((task) =>
          task.id === taskId ? { ...task, completed: !previousStatus } : task
        )
      );

      return { previousTasks };
    },
    onError: (error, previousStatus, context) => {
      // Error is already handled and shown via toast
      // Rollback optimistic update on error
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

  const handleChange = useCallback(() => {
    mutate(completed);
  }, [mutate, completed]);

  return (
    <Checkbox
      checked={completed}
      onCheckedChange={handleChange}
      aria-label="Complete Task"
    />
  );
}

export default TaskCompletionCheckbox;
