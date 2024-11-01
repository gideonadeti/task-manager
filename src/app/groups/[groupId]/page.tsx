"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { isToday, isTomorrow, isThisWeek, isPast, compareAsc } from "date-fns";
import { Task } from "@prisma/client";

import { readGroups, readTasks } from "@/app/query-functions";
import Spinner from "@/app/components/Spinner";
import { ExtendedGroup } from "@/app/type";
import { P } from "@/app/ui/CustomTags";
import { TasksTable } from "@/app/components/TasksTable";
import { columns } from "@/app/components/TasksTableColumns";

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
  } = useQuery<Task[], AxiosError>({
    queryKey: ["tasks"],
    queryFn: () => readTasks(user!.id),
  });

  useEffect(() => {
    if (groupsStatus === "error" || tasksStatus === "error") {
      const errorMessage =
        (groupsError?.response?.data as { error: string })?.error ||
        (tasksError?.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast({
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [groupsError, groupsStatus, tasksError, tasksStatus, toast]);

  const filteredTasks = useMemo(() => {
    if (!tasks?.length) return [];

    let result;
    switch (groupId) {
      case "inbox": {
        const inboxGroup = groups?.find((group) => group.name === "Inbox");
        result = inboxGroup ? inboxGroup.tasks : [];
        break;
      }
      case "today":
        result = tasks.filter(
          (task) => task.dueDate && isToday(task.dueDate) && !task.completed
        );
        break;
      case "tomorrow":
        result = tasks.filter(
          (task) => task.dueDate && isTomorrow(task.dueDate) && !task.completed
        );
        break;
      case "this-week":
        result = tasks.filter(
          (task) => task.dueDate && isThisWeek(task.dueDate) && !task.completed
        );
        break;
      case "overdue":
        result = tasks.filter(
          (task) =>
            task.dueDate &&
            isPast(task.dueDate) &&
            !isToday(task.dueDate) &&
            !task.completed
        );
        break;
      default:
        result = tasks.filter(
          (task) => task.groupId === groupId && !task.completed
        );
        break;
    }

    return result.sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;

      const dateComparison = compareAsc(a.dueDate, b.dueDate);
      if (dateComparison !== 0) return dateComparison;

      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return (
        (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
      );
    });
  }, [groupId, groups, tasks]);

  return (
    <div className="flex-grow">
      <div className="flex items-center justify-center">
        {(groupsStatus === "pending" || tasksStatus === "pending") && (
          <Spinner />
        )}
      </div>
      {filteredTasks.length > 0 ? (
        <TasksTable columns={columns} data={filteredTasks} />
      ) : (
        !(tasksStatus === "pending" || groupsStatus === "pending") && (
          <P className="text-center">No tasks found in this group</P>
        )
      )}
    </div>
  );
}
