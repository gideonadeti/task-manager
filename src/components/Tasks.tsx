import { useParams } from "react-router-dom";
import { isToday, isTomorrow, isThisWeek, isPast } from "date-fns";
import { useMemo } from "react";

import { Task } from "./Task";
import { AddTaskButton } from "./AddTaskButton";
import { useTasksStore } from "../stores/tasks";
import { useTaskGroupsStore } from "../stores/task-groups";

export function Tasks({ showSidebar }: { showSidebar: boolean }) {
  const { tasks } = useTasksStore();
  const { taskGroups } = useTaskGroupsStore();
  const { taskGroupId } = useParams();

  const filteredTasks = useMemo(() => {
    if (!taskGroupId || !tasks?.length) return [];

    switch (taskGroupId) {
      case "inbox": {
        const inboxGroup = taskGroups?.find((group) => group.name === "Inbox");
        return inboxGroup ? inboxGroup.tasks : [];
      }
      case "today":
        return tasks.filter((task) => task.dueDate && isToday(task.dueDate));
      case "tomorrow":
        return tasks.filter((task) => task.dueDate && isTomorrow(task.dueDate));
      case "this-week":
        return tasks.filter((task) => task.dueDate && isThisWeek(task.dueDate));
      case "overdue":
        return tasks.filter(
          (task) =>
            task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate)
        );
      default:
        return tasks.filter((task) => task.taskGroupId === taskGroupId);
    }
  }, [taskGroupId, tasks, taskGroups]);

  const taskGroupName = useMemo(() => {
    if (!taskGroupId) return "Tasks";

    switch (taskGroupId) {
      case "inbox":
        return "Inbox";
      case "today":
        return "Today";
      case "tomorrow":
        return "Tomorrow";
      case "this-week":
        return "This Week";
      case "overdue":
        return "Overdue";
      default: {
        const group = taskGroups?.find((group) => group.id === taskGroupId);
        return group?.name || "Tasks";
      }
    }
  }, [taskGroupId, taskGroups]);

  return (
    <div
      className={`px-5 pt-5 vh-100 overflow-y-auto tasks ${
        !showSidebar ? "expand" : ""
      }`}
    >
      <h3>{taskGroupName}</h3>

      {filteredTasks.length > 0 ? (
        <div className="my-3 list-group list-group-flush">
          {filteredTasks.map((task) => (
            <Task key={task.title} task={task} />
          ))}
        </div>
      ) : (
        <div className="alert alert-primary my-3 max-content mx-auto">
          No tasks available in this group!
        </div>
      )}

      <AddTaskButton className="max-content" />
    </div>
  );
}
