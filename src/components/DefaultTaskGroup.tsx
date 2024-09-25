import { useParams } from "react-router-dom";
import { DefaultTaskGroupProps } from "../lib/types";
import { StyledLink } from "./StyledLink";

export function DefaultTaskGroup({
  iconName,
  groupName,
  to,
  numOfTasks,
}: DefaultTaskGroupProps) {
  const { taskGroupId } = useParams();

  const className =
    taskGroupId === groupName.toLowerCase() ||
    (taskGroupId === "this-week" && groupName === "This Week")
      ? "active-group"
      : "";

  return (
    <StyledLink to={to} className={className}>
      <i className={`bi-${iconName}`}></i>
      <p>{groupName}</p>
      {typeof numOfTasks === "number" && numOfTasks > 0 && (
        <span className="badge text-bg-secondary ms-auto">{numOfTasks}</span>
      )}
    </StyledLink>
  );
}
