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
