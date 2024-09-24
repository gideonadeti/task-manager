import { DefaultTaskGroupProps } from "../lib/types";
import { StyledLink } from "./StyledLink";

export function DefaultTaskGroup({
  iconName,
  groupName,
  to,
  numOfTasks,
}: DefaultTaskGroupProps) {
  return (
    <StyledLink to={to}>
      <i className={`bi-${iconName}`}></i>
      <p>{groupName}</p>
      <span className="badge text-bg-secondary ms-auto">{numOfTasks}</span>
    </StyledLink>
  );
}
