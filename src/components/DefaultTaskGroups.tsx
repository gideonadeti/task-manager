import { useEffect } from "react";
import { isToday, isTomorrow, isThisWeek, isPast } from "date-fns";

import { defaultTaskGroups } from "../lib/default-task-groups";
import { useTaskGroupsStore } from "../stores/task-groups";
import { useTasksStore } from "../stores/tasks";
import { DefaultTaskGroup } from "./DefaultTaskGroup";
import { TaskGroup } from "../lib/types";
import { Task } from "../lib/types";

export function DefaultTaskGroups() {
  const { taskGroups } = useTaskGroupsStore();
  const { tasks, setTasks } = useTasksStore();

  useEffect(() => {
    const allTasks: Task[] = [];
    taskGroups?.forEach((taskGroup: TaskGroup) =>
      allTasks.push(...taskGroup.tasks)
    );

    setTasks(allTasks);
  }, [taskGroups, setTasks]);

  function getNumOfTasks(groupName: string) {
    let numOfTasks: number | undefined;
    switch (groupName) {
      case "Inbox":
        numOfTasks = taskGroups?.filter(
          (taskGroup) => taskGroup.name === "Inbox"
        )[0].tasks.length;
        return numOfTasks;
      case "Today":
        numOfTasks = tasks?.filter((task) => isToday(task.dueDate)).length;
        return numOfTasks;
      case "Tomorrow":
        numOfTasks = tasks?.filter((task) => isTomorrow(task.dueDate)).length;
        return numOfTasks;
      case "This Week":
        numOfTasks = tasks?.filter((task) => isThisWeek(task.dueDate)).length;
        return numOfTasks;
      case "Overdue":
        numOfTasks = tasks?.filter(
          (task) => isPast(task.dueDate) && !isToday(task.dueDate)
        ).length;
        return numOfTasks;
      default:
        break;
    }
  }

  return (
    <>
      {defaultTaskGroups.map((defaultTaskGroup) => (
        <DefaultTaskGroup
          key={defaultTaskGroup.groupName}
          groupName={defaultTaskGroup.groupName}
          iconName={defaultTaskGroup.iconName}
          to={defaultTaskGroup.to}
          numOfTasks={getNumOfTasks(defaultTaskGroup.groupName)}
        />
      ))}
    </>
  );
}
