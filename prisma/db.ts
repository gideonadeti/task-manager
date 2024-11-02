import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export async function readGroups(userId: string) {
  try {
    const groups = await prismaClient.group.findMany({
      where: {
        userId,
      },
      include: {
        tasks: true,
      },
    });

    // If there are no groups, create and return default group as list
    if (groups.length === 0) {
      const group = await createGroup("Inbox", userId);

      return [group];
    }

    return groups;
  } catch (error) {
    console.error("Error reading groups:", error);

    throw error;
  }
}

export async function createGroup(name: string, userId: string) {
  try {
    const group = await prismaClient.group.create({
      data: {
        name,
        userId,
      },
      include: {
        tasks: true,
      },
    });

    return group;
  } catch (error) {
    console.error("Error creating group:", error);

    throw error;
  }
}

export async function readTasks(userId: string) {
  try {
    const tasks = await prismaClient.task.findMany({
      where: {
        userId,
      },
    });

    return tasks;
  } catch (error) {
    console.error("Error reading groups:", error);

    throw error;
  }
}

export async function updateGroup(groupId: string, name: string) {
  try {
    const group = await prismaClient.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
      },
    });

    return group;
  } catch (error) {
    console.error("Error updating group:", error);

    throw error;
  }
}

export async function readGroup(name: string) {
  try {
    const group = await prismaClient.group.findFirst({
      where: {
        name,
      },
    });

    return group;
  } catch (error) {
    console.error("Error reading group:", error);

    throw error;
  }
}

export async function deleteGroup(groupId: string) {
  try {
    await prismaClient.group.delete({
      where: {
        id: groupId,
      },
    });
  } catch (error) {
    console.error("Error deleting group:", error);

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
    const task = await prismaClient.task.create({
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
    console.error("Error creating task:", error);

    throw error;
  }
}

export async function readTask(name: string) {
  try {
    const task = await prismaClient.task.findFirst({
      where: {
        title: name,
      },
    });

    return task;
  } catch (error) {
    console.error("Error reading task:", error);

    throw error;
  }
}

export async function updateTask(
  taskId: string,
  title: string,
  description: string,
  dueDate: Date,
  priority: "low" | "medium" | "high",
  groupId: string
) {
  try {
    const task = await prismaClient.task.update({
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
    console.error("Error updating task:", error);

    throw error;
  }
}

export async function deleteTask(taskId: string) {
  try {
    await prismaClient.task.delete({
      where: {
        id: taskId,
      },
    });
  } catch (error) {
    console.error("Error deleting task:", error);

    throw error;
  }
}

export async function toggleComplete(taskId: string, previousStatus: boolean) {
  try {
    const task = await prismaClient.task.update({
      where: {
        id: taskId,
      },
      data: {
        completed: !previousStatus,
      },
    });

    return task;
  } catch (error) {
    console.error("Error updating task:", error);

    throw error;
  }
}
