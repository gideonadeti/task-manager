"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { isToday, isTomorrow, isThisWeek, isPast, compareAsc } from "date-fns";

import useGroups from "../hooks/use-groups";
import useTasks from "../hooks/use-tasks";
import Spinner from "@/app/components/Spinner";
import { ExtendedGroup } from "@/app/type";
import { TasksTable } from "@/app/components/TasksTable";
import { columns } from "@/app/components/TasksTableColumns";
import NoTasks from "./components/no-tasks";

export default function GroupPage() {
  const { groupId } = useParams();
  const { groupsQuery } = useGroups();
  const { tasksQuery } = useTasks();

  const filteredTasks = useMemo(() => {
    if (!tasksQuery.data?.length) return [];

    let result;
    switch (groupId) {
      case "inbox": {
        const inboxGroup = groupsQuery.data?.find(
          (group) => group.name === "Inbox"
        ) as ExtendedGroup | undefined;
        result = tasksQuery.data.filter(
          (task) => task.groupId === inboxGroup?.id && !task.completed
        );
        break;
      }
      case "today":
        result = tasksQuery.data.filter(
          (task) => task.dueDate && isToday(task.dueDate) && !task.completed
        );
        break;
      case "tomorrow":
        result = tasksQuery.data.filter(
          (task) => task.dueDate && isTomorrow(task.dueDate) && !task.completed
        );
        break;
      case "this-week":
        result = tasksQuery.data.filter(
          (task) => task.dueDate && isThisWeek(task.dueDate) && !task.completed
        );
        break;
      case "overdue":
        result = tasksQuery.data.filter(
          (task) =>
            task.dueDate &&
            isPast(task.dueDate) &&
            !isToday(task.dueDate) &&
            !task.completed
        );
        break;
      case "completed":
        result = tasksQuery.data.filter((task) => task.completed);
        break;
      default:
        result = tasksQuery.data.filter(
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
  }, [groupId, groupsQuery.data, tasksQuery.data]);

  return (
    <div className="flex-1">
      <div className="flex items-center justify-center">
        {(groupsQuery.isPending || tasksQuery.isPending) && <Spinner />}
      </div>
      {filteredTasks.length > 0 ? (
        <TasksTable columns={columns} data={filteredTasks} />
      ) : (
        !(groupsQuery.isPending || tasksQuery.isPending) && (
          <NoTasks groupId={groupId as string} />
        )
      )}
    </div>
  );
}
