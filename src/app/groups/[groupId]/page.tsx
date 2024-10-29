"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import { readGroups, readTasks } from "@/app/query-functions";
import Spinner from "@/app/components/Spinner";
import { Group, Task } from "@prisma/client";
import { useEffect } from "react";

export default function GroupPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const {
    status: groupsStatus,
    data: groups,
    error: groupsError,
  } = useQuery<Group[], AxiosError>({
    queryKey: ["groups"],
    queryFn: () => readGroups(user!.id),
  });
  const {
    status: tasksStatus,
    data: tasks,
    error: tasksError,
  } = useQuery<Task[], AxiosError>({
    queryKey: ["tasks"],
    queryFn: () => readTasks(user!.id),
  });

  useEffect(() => {
    if (groupsStatus === "error") {
      const errorMessage = (groupsError?.response?.data as { error: string })
        .error;
      toast({
        description: errorMessage || "Something went wrong",
        variant: "destructive",
      });
    }

    if (tasksStatus === "error") {
      const errorMessage = (tasksError?.response?.data as { error: string })
        .error;
      toast({
        description: errorMessage || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [groupsError, groupsStatus, tasksError, tasksStatus, toast]);

  return (
    <div className="flex-grow p-2">
      <div className="flex items-center justify-center">
        {(groupsStatus === "pending" || tasksStatus === "pending") && (
          <Spinner />
        )}
      </div>

      {groups && groups.length > 0 && (
        <div>Number of groups: {groups.length}</div>
      )}
      {tasks && tasks.length > 0 && <div>Number of tasks: {tasks.length}</div>}
    </div>
  );
}
