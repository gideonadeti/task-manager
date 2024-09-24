import { defaultTaskGroups } from "../lib/default-task-groups";
import { useTaskGroupsStore } from "../stores/task-groups";
import { DefaultTaskGroup } from "./DefaultTaskGroup";
import { TaskGroup } from "../lib/types";
import { Task } from "../lib/types";

export function DefaultTaskGroups() {
  const { taskGroups } = useTaskGroupsStore();
  const allTasks: Task[] = [];

  taskGroups?.forEach((taskGroup: TaskGroup) =>
    allTasks.push(...taskGroup.tasks)
  );

  function getRandomNum() {
    return Math.floor(Math.random() * 10 + 1);
  }

  return defaultTaskGroups.map((defaultTaskGroup) => (
    <DefaultTaskGroup
      groupName={defaultTaskGroup.groupName}
      iconName={defaultTaskGroup.iconName}
      to={defaultTaskGroup.to}
      numOfTasks={getRandomNum()}
    />
  ));
}
