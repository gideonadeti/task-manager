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
  onClick?: () => void;
}

export interface StyledLinkProps extends ClickableElementProps {
  to: string;
}

export interface DefaultTaskGroupProps {
  iconName: string;
  groupName: string;
  to: string;
  numOfTasks: number | undefined;
}

export interface TaskProps {
  taskGroupId: string;
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: "Low" | "Medium" | "High";
  isCompleted: boolean;
}

export interface ErrorPageProps {
  statusText?: string;
  message?: string;
}

export interface UserStore {
  user: User | null;
  setUser: (newUser: User) => void;
  clearUser: () => void;
}

export interface TaskGroupsStore {
  taskGroups: TaskGroup[] | [];
  setTaskGroups: (taskGroups: TaskGroup[]) => void;
  clearTaskGroups: () => void;
}

export interface TasksStore {
  tasks: Task[] | [];
  setTasks: (tasks: Task[]) => void;
  clearTasks: () => void;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: Date;
  priority: "Low" | "Medium" | "High";
  taskGroupId: string;
}

export interface TaskGroup {
  id: string;
  name: string;
  tasks: Task[];
}
