import { defaultTaskGroups } from "../lib/default-task-groups";
import { DefaultTaskGroup } from "./DefaultTaskGroup";

export function DefaultTaskGroups() {
  return defaultTaskGroups.map((defaultTaskGroup) => (
    <DefaultTaskGroup
      groupName={defaultTaskGroup.groupName}
      iconName={defaultTaskGroup.iconName}
      to={defaultTaskGroup.to}
    />
  ));
}
