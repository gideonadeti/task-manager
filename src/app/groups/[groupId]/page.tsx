"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { isToday, isTomorrow, isThisWeek, isPast } from "date-fns";

import { readGroups, readTasks } from "@/app/query-functions";
import Spinner from "@/app/components/Spinner";
import { ExtendedGroup, ExtendedTask } from "@/app/type";
import { P } from "@/app/ui/CustomTags";

export default function GroupPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { groupId } = useParams();
  const {
    status: groupsStatus,
    data: groups,
    error: groupsError,
  } = useQuery<ExtendedGroup[], AxiosError>({
    queryKey: ["groups"],
    queryFn: () => readGroups(user!.id),
  });
  const {
    status: tasksStatus,
    data: tasks,
    error: tasksError,
  } = useQuery<ExtendedTask[], AxiosError>({
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

  const filteredTasks = useMemo(() => {
    if (!groupId || !tasks?.length) return [];

    switch (groupId) {
      case "inbox": {
        const inboxGroup = groups?.find((group) => group.name === "Inbox");
        return inboxGroup ? inboxGroup.tasks : [];
      }
      case "today":
        return tasks.filter((task) => task.dueDate && isToday(task.dueDate));
      case "tomorrow":
        return tasks.filter((task) => task.dueDate && isTomorrow(task.dueDate));
      case "this-week":
        return tasks.filter((task) => task.dueDate && isThisWeek(task.dueDate));
      case "past":
        return tasks.filter(
          (task) =>
            task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate)
        );
      default:
        return tasks.filter((task) => task.groupId === groupId);
    }
  }, [groupId, groups, tasks]);

  return (
    <div className="flex-grow p-2">
      <div className="flex items-center justify-center">
        {(groupsStatus === "pending" || tasksStatus === "pending") && (
          <Spinner />
        )}
        {filteredTasks.length > 0 ? (
          <P>{filteredTasks.length} tasks found in this group</P>
        ) : (
          <P className="text-center">No tasks found in this group</P>
        )}
      </div>
    </div>
  );
}
