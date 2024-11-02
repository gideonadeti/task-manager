import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Task } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import { Checkbox } from "@/components/ui/checkbox";
import { toggleComplete } from "@/app/query-functions";
import { ExtendedGroup } from "../type";

type TaskCompletionCheckboxProps = {
  taskId: string;
  completed: boolean;
};

export default function TaskCompletionCheckbox({
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
      await queryClient.cancelQueries({ queryKey: ["groups"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      const previousGroups = queryClient.getQueryData<ExtendedGroup[]>([
        "groups",
      ]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.map((task) =>
          task.id === taskId ? { ...task, completed: !previousStatus } : task
        )
      );

      queryClient.setQueryData<ExtendedGroup[]>(["groups"], (oldGroups) =>
        oldGroups?.map((group) =>
          group.tasks.some((task) => task.id === taskId)
            ? {
                ...group,
                tasks: group.tasks.map((task) =>
                  task.id === taskId
                    ? { ...task, completed: !previousStatus }
                    : task
                ),
              }
            : group
        )
      );

      return { previousTasks, previousGroups };
    },
    onError: (error, previousStatus, context) => {
      console.error(error);

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

  function handleChange() {
    mutate(completed);
  }

  return (
    <Checkbox
      checked={completed}
      onCheckedChange={handleChange}
      aria-label="Complete Task"
    />
  );
}
