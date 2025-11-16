import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  createGroup,
  readGroups,
  updateGroup,
  deleteGroup,
} from "@/lib/api/query-functions";
import { Group, Task } from "@prisma/client";
import { handleApiError } from "@/lib/api/error-handler";

const useGroups = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const groupsQuery = useQuery<Group[], AxiosError>({
    queryKey: ["groups"],
    queryFn: () => readGroups(),
  });

  // Error handling effect
  useEffect(() => {
    if (groupsQuery.isError) {
      handleApiError(groupsQuery.error);
    }
  }, [groupsQuery.isError, groupsQuery.error]);

  const createGroupMutation = useMutation<
    Group,
    AxiosError,
    {
      name: string;
      onOpenChange: (open: boolean) => void;
    }
  >({
    mutationFn: ({ name }) => {
      return createGroup(name);
    },
    onError: (err) => {
      handleApiError(err);
    },
    onSuccess: (createdGroup, { onOpenChange }) => {
      onOpenChange(false);

      toast.success("Group created successfully");
      queryClient.setQueryData<Group[]>(["groups"], (prevGroups) => {
        return [createdGroup, ...(prevGroups || [])];
      });

      router.push(`/groups/${createdGroup.id}`);
    },
  });

  const updateGroupMutation = useMutation<
    Group,
    AxiosError,
    {
      id: string;
      name: string;
      onOpenChange: (open: boolean) => void;
    }
  >({
    mutationFn: ({ id, name }) => {
      return updateGroup(id, name);
    },
    onError: (err) => {
      handleApiError(err);
    },
    onSuccess: (updatedGroup, { onOpenChange }) => {
      onOpenChange(false);

      toast.success("Group updated successfully");
      queryClient.setQueryData<Group[]>(["groups"], (prevGroups) => {
        return prevGroups?.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        );
      });

      router.push(`/groups/${updatedGroup.id}`);
    },
  });

  const deleteGroupMutation = useMutation<
    Group,
    AxiosError,
    { id: string; onOpenChange: (open: boolean) => void },
    {
      previousGroups: Group[] | undefined;
      previousTasks: Task[] | undefined;
    }
  >({
    mutationFn: ({ id }) => {
      return deleteGroup(id);
    },
    onMutate: async ({ id, onOpenChange }) => {
      await queryClient.cancelQueries({ queryKey: ["groups"] });
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousGroups = queryClient.getQueryData<Group[]>(["groups"]);
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      // Optimistically remove tasks belonging to the group
      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) =>
        oldTasks?.filter((task) => task.groupId !== id)
      );

      // Optimistically remove the group
      queryClient.setQueryData<Group[]>(["groups"], (oldGroups) =>
        oldGroups?.filter((group) => group.id !== id)
      );

      // Close dialog immediately
      onOpenChange(false);

      // Navigate to inbox group immediately
      router.push("/groups/inbox");

      return { previousGroups, previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousGroups) {
        queryClient.setQueryData(["groups"], context.previousGroups);
      }
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      // Reopen dialog on error
      variables.onOpenChange(true);
      handleApiError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Group deleted successfully");
    },
  });

  return {
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
    groupsQuery,
  };
};

export default useGroups;
