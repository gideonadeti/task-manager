import { ReactNode } from "react";

export interface FormValues extends User {
  password: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ClickableElementProps {
  children: ReactNode;
}

export interface StyledLinkProps extends ClickableElementProps {
  to: string;
}

export interface DefaultTaskGroupProps {
  iconName: string;
  groupName: string;
  to: string;
}
