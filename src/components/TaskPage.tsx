import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  isToday,
  isTomorrow,
  isYesterday,
  formatDistanceToNow,
} from "date-fns";

import { useTasksStore } from "../stores/tasks";
import { useUserStore } from "../stores/user";
import { Sidebar } from "./Sidebar";
import { SidebarToggler } from "./SidebarToggler";

export default function TaskPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const { taskId } = useParams();

  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/sign-in");
    }
  }, [user, navigate]);

  return (
    <div className="position-relative">
      <Sidebar showSidebar={showSidebar} />
      <Task showSidebar={showSidebar} taskId={taskId} />
      <SidebarToggler onClick={() => setShowSidebar(!showSidebar)} />
    </div>
  );
}

function Task({
  showSidebar,
  taskId,
}: {
  showSidebar: boolean;
  taskId: string | undefined;
}) {
  const { tasks } = useTasksStore();

  const task = tasks?.find((task) => task.id === taskId);

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

  // TODO: add edit and delete buttons

  if (!task) {
    return (
      <div
        className={`px-5 pt-5 vh-100 overflow-y-auto tasks ${
          !showSidebar ? "expand" : ""
        }`}
      >
        <p>Task not found.</p>
      </div>
    );
  }

  return (
    <div
      className={`px-5 pt-5 vh-100 overflow-y-auto tasks ${
        !showSidebar ? "expand" : ""
      }`}
    >
      <div className="d-flex">
        <input
          type="checkbox"
          name="completed"
          className="form-check-input rounded-circle me-3 pointer-style"
        />
        <div>
          <h5>{task.title}</h5>
          <p>{task.description}</p>
          <div className="d-flex gap-2 py-1">
            <p className="due-date bg-primary-subtle">
              Due Date:{" "}
              {task.dueDate ? formatDueDate(task.dueDate) : "undefined"}
            </p>
            <p className={`priority ${getPriorityClass(task.priority)}`}>
              Priority: {task.priority.toLowerCase()}
            </p>
          </div>
        </div>
        <div className="ms-auto">
          <span className="p-3 rounded-circle me-3 bg-light hover-style">
            <i className="bi-pencil"></i>
          </span>
          <span className="p-3 rounded-circle bg-danger-subtle hover-style">
            <i className="bi-trash"></i>
          </span>
        </div>
      </div>
    </div>
  );
}
