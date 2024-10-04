import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useTaskGroupsStore } from "../stores/task-groups";
import { TaskGroup } from "../lib/types";
import { StyledLink } from "./StyledLink";

export default function CustomTaskGroups() {
  const { taskGroups } = useTaskGroupsStore();
  const [customTaskGroups, setCustomTaskGroups] = useState<TaskGroup[]>([]);

  useEffect(() => {
    setCustomTaskGroups(
      taskGroups.filter((taskGroup) => taskGroup.name !== "Inbox")
    );
  }, [taskGroups]);

  function getNumOfTasks(groupId: string) {
    return customTaskGroups.find((group) => group.id === groupId)?.tasks.length;
  }

  return (
    <>
      {customTaskGroups.map((group: TaskGroup) => (
        <CustomTaskGroup
          key={group.id}
          id={group.id}
          name={group.name}
          to={`/task-groups/${group.id}`}
          numOfTasks={getNumOfTasks(group.id)}
        />
      ))}
    </>
  );
}

function CustomTaskGroup({
  id,
  name,
  to,
  numOfTasks,
}: {
  id: string;
  name: string;
  to: string;
  numOfTasks: number | undefined;
}) {
  const { taskGroupId } = useParams();

  const className = taskGroupId === id ? "active-group" : "";

  return (
    <StyledLink to={to} className={className}>
      <i className="bi-collection"></i>
      <p>{name}</p>
      {typeof numOfTasks === "number" && numOfTasks > 0 && (
        <span className="badge text-bg-secondary ms-auto">{numOfTasks}</span>
      )}
    </StyledLink>
  );
}
