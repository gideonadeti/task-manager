import { AddTaskButton } from "./AddTaskButton";
import { DefaultTaskGroups } from "./DefaultTaskGroups";
import { AddTaskGroup } from "./AddTaskGroup";

export function Sidebar() {
  return (
    <div className="sidebar p-3 bg-light overflow-y-auto overflow-x-hidden">
      <AddTaskButton />
      <div className="my-3">
        <DefaultTaskGroups />
      </div>
      <AddTaskGroup />
    </div>
  );
}
