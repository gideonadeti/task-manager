import { Group, Task } from "@prisma/client";

export interface ExtendedGroup extends Group {
  tasks: Task[];
}

export interface ExtendedTask extends Task {
  group: Group;
}
