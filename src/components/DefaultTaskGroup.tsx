import { DefaultTaskGroupProps } from "../lib/types";
import { StyledLink } from "./StyledLink";

export function DefaultTaskGroup({
  iconName,
  groupName,
  to,
}: DefaultTaskGroupProps) {
  return (
    <StyledLink to={to}>
      <i className={`bi-${iconName}`}></i>
      <p>{groupName}</p>
    </StyledLink>
  );
}
