import { tasks } from "../lib/tasks";
import { Task } from "./Task";
import { AddTaskButton } from "./AddTaskButton";

export function Tasks() {
  return (
    <div className="px-5 py-5 mb-5 overflow-y-auto flex-grow-1">
      <h3>Inbox</h3>
      <div className="my-3 list-group list-group-flush">
        {tasks.map((task) => (
          <Task task={task} />
        ))}
      </div>
      <AddTaskButton className="max-content" />
    </div>
  );
}
