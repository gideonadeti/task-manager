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
      // Removed include tasks - tasks are fetched separately, this was causing unnecessary joins
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
      // Removed include tasks - tasks are fetched separately, this was causing unnecessary joins
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
    // Optimize: Use updateMany to combine auth check and update, then verify result
    const result = await prisma.group.updateMany({
      where: {
        id: groupId,
        userId, // Authorization check built into where clause
      },
      data: {
        name,
      },
    });

    // If no rows were updated, the group doesn't exist or doesn't belong to user
    if (result.count === 0) {
      throw new AuthorizationError();
    }

    // Fetch the updated group
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new AuthorizationError();
    }

    return group;
  } catch (error) {
    // If it's already an AuthorizationError, rethrow it
    if (error instanceof AuthorizationError) {
      throw error;
    }
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
    // Optimize: First verify the group belongs to the user using findUnique with id only
    // then delete. This avoids an extra query if we can't find it.
    const existingGroup = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!existingGroup || existingGroup.userId !== userId) {
      throw new AuthorizationError();
    }

    const group = await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    return group;
  } catch (error) {
    // If it's already an AuthorizationError, rethrow it
    if (error instanceof AuthorizationError) {
      throw error;
    }
    logger.error("Error deleting group", error, { groupId, userId });
    throw error;
  }
}

export async function createTask(
  title: string,
  description: string,
  dueDate: Date | null | undefined,
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

export async function readTask(name: string, userId: string, groupId?: string) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        title: name,
        userId,
        ...(groupId && { groupId }),
      },
    });

    return task;
  } catch (error) {
    logger.error("Error reading task", error, { name, userId, groupId });
    throw error;
  }
}

export async function readTaskById(taskId: string, userId: string) {
  try {
    // Optimize: Use findUnique for id lookup (faster with index)
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    // Verify ownership
    if (task && task.userId !== userId) {
      return null;
    }

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
  dueDate: Date | null | undefined,
  priority: "low" | "medium" | "high",
  groupId: string,
  userId: string
) {
  try {
    // Optimize: Use updateMany to combine auth check and update, then verify result
    const result = await prisma.task.updateMany({
      where: {
        id: taskId,
        userId, // Authorization check built into where clause
      },
      data: {
        title,
        description,
        dueDate,
        priority,
        groupId,
      },
    });

    // If no rows were updated, the task doesn't exist or doesn't belong to user
    if (result.count === 0) {
      throw new AuthorizationError();
    }

    // Fetch the updated task
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new AuthorizationError();
    }

    return task;
  } catch (error) {
    // If it's already an AuthorizationError, rethrow it
    if (error instanceof AuthorizationError) {
      throw error;
    }
    logger.error("Error updating task", error, { taskId, userId });
    throw error;
  }
}

export async function deleteTask(taskId: string, userId: string) {
  try {
    // Optimize: First verify the task belongs to the user using findUnique with id only
    // then delete. This avoids an extra query if we can't find it.
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!existingTask || existingTask.userId !== userId) {
      throw new AuthorizationError();
    }

    const task = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return task;
  } catch (error) {
    // If it's already an AuthorizationError, rethrow it
    if (error instanceof AuthorizationError) {
      throw error;
    }
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
    // Optimize: Use updateMany to combine auth check and update, then verify result
    const result = await prisma.task.updateMany({
      where: {
        id: taskId,
        userId, // Authorization check built into where clause
        completed: previousStatus, // Also verify current status matches
      },
      data: {
        completed: !previousStatus,
      },
    });

    // If no rows were updated, the task doesn't exist, doesn't belong to user, or status changed
    if (result.count === 0) {
      // Check if task exists at all
      const taskExists = await prisma.task.findUnique({
        where: { id: taskId },
        select: { id: true, userId: true },
      });

      if (!taskExists || taskExists.userId !== userId) {
        throw new AuthorizationError();
      }
      // If task exists but status doesn't match, that's okay - just fetch current state
    }

    // Fetch the updated task
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new AuthorizationError();
    }

    return task;
  } catch (error) {
    // If it's already an AuthorizationError, rethrow it
    if (error instanceof AuthorizationError) {
      throw error;
    }
    logger.error("Error toggling task completion", error, {
      taskId,
      previousStatus,
      userId,
    });
    throw error;
  }
}
