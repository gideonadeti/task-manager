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

      // Navigate to the task's group
      const isInboxGroup = updatedGroup.name === "Inbox";
      const targetGroupId = isInboxGroup ? "inbox" : updatedGroup.id;
      router.push(`/groups/${targetGroupId}`);
    },
  });

  const deleteGroupMutation = useMutation<
    Group,
    AxiosError,
    { id: string; onOpenChange: (open: boolean) => void }
  >({
    mutationFn: ({ id }) => {
      return deleteGroup(id);
    },
    onError: (err) => {
      handleApiError(err);
    },
    onSuccess: (deletedGroup, { onOpenChange }) => {
      onOpenChange(false);

      toast.success("Group deleted successfully");
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) => {
        return prevTasks?.filter((task) => task.groupId !== deletedGroup.id);
      });

      queryClient.setQueryData<Group[]>(["groups"], (prevGroups) => {
        return prevGroups?.filter((group) => group.id !== deletedGroup.id);
      });

      // Navigate to inbox group after deletion
      router.push("/groups/inbox");
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
