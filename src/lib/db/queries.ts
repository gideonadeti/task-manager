import { prisma } from "./prisma-client";
import { logger } from "../logger";
import { AuthorizationError } from "../errors";

export async function readGroups(userId: string) {
  try {
    const groups = await prisma.group.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        tasks: {
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    // If there are no groups, create and return default group as list
    if (groups.length === 0) {
      const group = await createGroup("Inbox", userId);

      return [group];
    }

    return groups;
  } catch (error) {
    logger.error("Error reading groups", error, { userId });
    throw error;
  }
}

export async function createGroup(name: string, userId: string) {
  try {
    const group = await prisma.group.create({
      data: {
        name,
        userId,
      },
      include: {
        tasks: {
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    return group;
  } catch (error) {
    logger.error("Error creating group", error, { name, userId });
    throw error;
  }
}

export async function readTasks(userId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return tasks;
  } catch (error) {
    logger.error("Error reading tasks", error, { userId });
    throw error;
  }
}

export async function updateGroup(
  groupId: string,
  name: string,
  userId: string
) {
  try {
    // First verify the group belongs to the user
    const existingGroup = await prisma.group.findFirst({
      where: {
        id: groupId,
        userId,
      },
    });

    if (!existingGroup) {
      throw new AuthorizationError();
    }

    const group = await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
      },
    });

    return group;
  } catch (error) {
    logger.error("Error updating group", error, { groupId, name, userId });
    throw error;
  }
}

export async function readGroup(userId: string, name: string) {
  try {
    const group = await prisma.group.findFirst({
      where: {
        userId,
        name,
      },
    });

    return group;
  } catch (error) {
    logger.error("Error reading group", error, { userId, name });
    throw error;
  }
}

export async function deleteGroup(groupId: string, userId: string) {
  try {
    // First verify the group belongs to the user
    const existingGroup = await prisma.group.findFirst({
      where: {
        id: groupId,
        userId,
      },
    });

    if (!existingGroup) {
      throw new AuthorizationError();
    }

    const group = await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    return group;
  } catch (error) {
    logger.error("Error deleting group", error, { groupId, userId });
    throw error;
  }
}

export async function createTask(
  title: string,
  description: string,
  dueDate: Date,
  priority: "low" | "medium" | "high",
  groupId: string,
  userId: string
) {
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        priority,
        groupId,
        userId,
      },
    });

    return task;
  } catch (error) {
    logger.error("Error creating task", error, {
      title,
      groupId,
      userId,
    });
    throw error;
  }
}

export async function readTask(name: string, userId: string) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        title: name,
        userId,
      },
    });

    return task;
  } catch (error) {
    logger.error("Error reading task", error, { name, userId });
    throw error;
  }
}

export async function readTaskById(taskId: string, userId: string) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    return task;
  } catch (error) {
    logger.error("Error reading task by ID", error, { taskId, userId });
    throw error;
  }
}

export async function updateTask(
  taskId: string,
  title: string,
  description: string,
  dueDate: Date,
  priority: "low" | "medium" | "high",
  groupId: string,
  userId: string
) {
  try {
    // First verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new AuthorizationError();
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        description,
        dueDate,
        priority,
        groupId,
      },
    });

    return task;
  } catch (error) {
    logger.error("Error updating task", error, { taskId, userId });
    throw error;
  }
}

export async function deleteTask(taskId: string, userId: string) {
  try {
    // First verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new AuthorizationError();
    }

    const task = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return task;
  } catch (error) {
    logger.error("Error deleting task", error, { taskId, userId });
    throw error;
  }
}

export async function toggleComplete(
  taskId: string,
  previousStatus: boolean,
  userId: string
) {
  try {
    // First verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new AuthorizationError();
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        completed: !previousStatus,
      },
    });

    return task;
  } catch (error) {
    logger.error("Error toggling task completion", error, {
      taskId,
      previousStatus,
      userId,
    });
    throw error;
  }
}
