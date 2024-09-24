import { tasks } from "../lib/tasks";
import { Task } from "./Task";
import { AddTaskButton } from "./AddTaskButton";

export function Tasks({ showSidebar }: { showSidebar: boolean }) {
  return (
    <div
      className={`px-5 pt-5 vh-100 overflow-y-auto tasks ${
        !showSidebar ? "expand" : ""
      }`}
    >
      <h3>Inbox</h3>
      <div className="my-3 list-group list-group-flush">
        {tasks.map((task) => (
          <Task key={task.title} task={task} />
        ))}
      </div>
      <AddTaskButton className="max-content" />
    </div>
  );
}
