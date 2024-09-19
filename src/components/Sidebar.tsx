import { AddTaskButton } from "./AddTaskButton";
import { DefaultTaskGroups } from "./DefaultTaskGroups";
import { AddTaskGroup } from "./AddTaskGroup";

export function Sidebar({ showSidebar }: { showSidebar: boolean }) {
  return (
    <div
      className={`sidebar p-3 bg-light overflow-y-auto overflow-x-hidden ${
        !showSidebar ? "hide-sidebar" : ""
      }`}
    >
      <AddTaskButton />
      <div className="my-3">
        <DefaultTaskGroups />
      </div>
      <AddTaskGroup />
    </div>
  );
}
