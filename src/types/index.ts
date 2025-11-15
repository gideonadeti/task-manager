import { Group, Task } from "@prisma/client";

export interface ExtendedGroup extends Group {
  tasks: Task[];
}

export interface ExtendedTask extends Task {
  group: Group;
}

// API Response Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ErrorDetails;
  };
}

export type ErrorDetails =
  | string
  | { field: string; message: string }[]
  | Record<string, unknown>;

// Task API Response Types
export interface TasksResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
}

export interface TaskMessageResponse {
  message: string;
}

// Group API Response Types
export interface GroupsResponse {
  groups: Group[];
}

export interface GroupResponse {
  group: Group;
}

// Axios Error Response Type
export interface AxiosErrorResponse {
  error: string;
  details?: ErrorDetails;
}
