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
  className?: string;
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

export interface TaskProps {
  title: string;
  description: string;
  dueDate: Date;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
}

export interface ErrorPageProps {
  statusText?: string;
  message?: string;
};