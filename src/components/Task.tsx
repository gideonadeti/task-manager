import {
  isToday,
  isTomorrow,
  isYesterday,
  formatDistanceToNow,
} from "date-fns";
import { Link } from "react-router-dom";

import { TaskProps } from "../lib/types";

export function Task({ task }: { task: TaskProps }) {
  function formatDueDate(dueDate: Date) {
    const date = new Date(dueDate);

    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  }

  function getPriorityClass(priority: string) {
    return priority === "HIGH"
      ? "bg-danger-subtle"
      : priority === "MEDIUM"
      ? "bg-warning-subtle"
      : "bg-success-subtle";
  }

  return (
    <li className="list-group-item d-flex">
      <input
        type="checkbox"
        name="completed"
        className="form-check-input rounded-circle me-3 pointer-style"
      />
      <Link to={`/task-groups/${task.taskGroupId}/tasks/${task.id}`} className="text-reset">
        <h5>{task.title}</h5>
        <p className="description">{task.description}</p>
        <div className="d-flex gap-2 py-1">
          <p className="due-date bg-primary-subtle">
            Due Date: {task.dueDate ? formatDueDate(task.dueDate) : "undefined"}
          </p>
          <p className={`priority ${getPriorityClass(task.priority)}`}>
            Priority: {task.priority.toLowerCase()}
          </p>
        </div>
      </Link>
    </li>
  );
}
