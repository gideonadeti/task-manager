import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

import {
  createGroup,
  readGroups,
  updateGroup,
  deleteGroup,
} from "@/lib/api/query-functions";
import { UseFormReturn } from "react-hook-form";
import { Group, Task } from "@prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { hasAxiosResponse, isAxiosErrorResponse } from "@/lib/type-guards";

type GroupFormData = {
  name: string;
};

const useGroups = () => {
  const queryClient = useQueryClient();
  const createGroupMutation = useMutation<
    Group,
    AxiosError,
    {
      name: string;
      form: UseFormReturn<GroupFormData, GroupFormData, undefined>;
      router: AppRouterInstance;
    }
  >({
    mutationFn: ({ name }) => {
      return createGroup(name);
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
    onSuccess: (createdGroup, { form, router }) => {
      toast.success("Group created successfully");

      form.reset();
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
      form: UseFormReturn<GroupFormData, GroupFormData, undefined>;
      router: AppRouterInstance;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }
  >({
    mutationFn: ({ id, name }) => {
      return updateGroup(id, name);
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
    onSuccess: (updatedGroup, { form, router, open, onOpenChange }) => {
      onOpenChange(open);

      toast.success("Group updated successfully");
      form.reset();
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
    { id: string; onOpenChange: (open: boolean) => void }
  >({
    mutationFn: ({ id }) => {
      return deleteGroup(id);
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
    onSuccess: (deletedGroup, { onOpenChange }) => {
      onOpenChange(false);

      toast.success("Group deleted successfully");
      queryClient.setQueryData<Task[]>(["tasks"], (prevTasks) => {
        return prevTasks?.filter((task) => task.groupId !== deletedGroup.id);
      });

      queryClient.setQueryData<Group[]>(["groups"], (prevGroups) => {
        return prevGroups?.filter((group) => group.id !== deletedGroup.id);
      });
    },
  });

  const groupsQuery = useQuery<Group[], AxiosError>({
    queryKey: ["groups"],
    queryFn: () => readGroups(),
  });

  // Error handling effect
  useEffect(() => {
    if (groupsQuery.status === "error" && groupsQuery.error) {
      let description = "Something went wrong";

      if (
        hasAxiosResponse(groupsQuery.error) &&
        groupsQuery.error.response?.data
      ) {
        if (isAxiosErrorResponse(groupsQuery.error.response.data)) {
          description = groupsQuery.error.response.data.error;
        }
      }

      toast.error(description);
    }
  }, [groupsQuery.error, groupsQuery.status]);

  return {
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
    groupsQuery,
  };
};

export default useGroups;
