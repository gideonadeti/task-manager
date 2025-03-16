import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import {
  createGroup,
  readGroups,
  updateGroup,
  deleteGroup,
} from "@/app/query-functions";
import { UseFormReturn } from "react-hook-form";
import { Group } from "@prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const useGroups = () => {
  const { user } = useUser();

  const queryClient = useQueryClient();
  const createGroupMutation = useMutation<
    Group,
    AxiosError,
    {
      name: string;
      form: UseFormReturn<
        {
          name: string;
        },
        unknown,
        undefined
      >;
      router: AppRouterInstance;
    }
  >({
    mutationFn: ({ name }) => {
      return createGroup(name, user!.id);
    },
    onError: (err) => {
      const description =
        (err?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (createdGroup, { form, router }) => {
      form.reset();
      toast.success("Group created successfully");

      queryClient.setQueryData<Group[]>(["groups"], (prevGroups) => {
        const groupsArray = Array.isArray(prevGroups) ? prevGroups : [];

        return [...groupsArray, createdGroup];
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
      form: UseFormReturn<{ name: string }, unknown, undefined>;
      router: AppRouterInstance;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }
  >({
    mutationFn: ({ id, name }) => {
      return updateGroup(user!.id, id, name);
    },
    onError: (err) => {
      const description =
        (err?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (updatedGroup, { form, router, open, onOpenChange }) => {
      form.reset();
      toast.success("Group updated successfully");

      queryClient.setQueryData<Group[]>(["groups"], (prevGroups) => {
        return prevGroups?.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        );
      });

      router.push(`/groups/${updatedGroup.id}`);
      onOpenChange(open);
    },
  });

  const deleteGroupMutation = useMutation<
    { id: string },
    AxiosError,
    { id: string }
  >({
    mutationFn: ({ id }) => {
      return deleteGroup(id);
    },
    onError: (err) => {
      const description =
        (err?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: ({ id }) => {
      toast.success("Group deleted successfully");

      queryClient.setQueryData<Group[]>(["groups"], (prevGroups) => {
        return prevGroups?.filter((group) => group.id !== id);
      });
    },
  });

  const groupsQuery = useQuery<Group[], AxiosError>({
    queryKey: ["groups"],
    queryFn: () => readGroups(user!.id),
  });

  // Error handling effect
  useEffect(() => {
    if (groupsQuery.status === "error") {
      const description =
        (groupsQuery.error?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast.error(description);
    }
  }, [groupsQuery.error?.response?.data, groupsQuery.status]);

  return {
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
    groupsQuery,
  };
};

export default useGroups;
