import axios from "axios";
import { logger } from "../logger";

export async function readGroups() {
  try {
    const response = await axios.get("/api/groups");

    return response.data.groups;
  } catch (error) {
    logger.error("Error reading groups", error);
    throw error;
  }
}

export async function createGroup(name: string) {
  try {
    const response = await axios.post("/api/groups", {
      name,
    });

    return response.data.group;
  } catch (error) {
    logger.error("Error creating group", error, { name });
    throw error;
  }
}

export async function readTasks() {
  try {
    const response = await axios.get("/api/tasks");

    return response.data.tasks;
  } catch (error) {
    logger.error("Error reading tasks", error);
    throw error;
  }
}

export async function updateGroup(groupId: string, name: string) {
  try {
    const response = await axios.patch(`/api/groups/${groupId}`, {
      name,
    });

    return response.data.group;
  } catch (error) {
    logger.error("Error updating group", error, { groupId, name });
    throw error;
  }
}

export async function deleteGroup(groupId: string) {
  try {
    const response = await axios.delete(`/api/groups/${groupId}`);

    return response.data.group;
  } catch (error) {
    logger.error("Error deleting group", error, { groupId });
    throw error;
  }
}

export async function createTask(
  title: string,
  description: string,
  priority: string,
  groupId: string,
  dueDate?: Date
) {
  try {
    const response = await axios.post("/api/tasks", {
      title,
      description,
      dueDate,
      priority,
      groupId,
    });

    return response.data.task;
  } catch (error) {
    logger.error("Error creating task", error, { title, groupId });
    throw error;
  }
}

export async function updateTask(
  taskId: string,
  title: string,
  description: string,
  priority: string,
  groupId: string,
  dueDate?: Date
) {
  try {
    const response = await axios.put(`/api/tasks/${taskId}`, {
      title,
      description,
      dueDate,
      priority,
      groupId,
    });

    return response.data.task;
  } catch (error) {
    logger.error("Error updating task", error, { taskId });
    throw error;
  }
}

export async function deleteTask(taskId: string) {
  try {
    const response = await axios.delete(`/api/tasks/${taskId}`);

    return response.data.task;
  } catch (error) {
    logger.error("Error deleting task", error, { taskId });
    throw error;
  }
}

export async function toggleComplete(taskId: string, previousStatus: boolean) {
  try {
    const response = await axios.patch(`/api/tasks/${taskId}`, {
      previousStatus,
    });

    return response.data.message;
  } catch (error) {
    logger.error("Error toggling task completion", error, {
      taskId,
      previousStatus,
    });
    throw error;
  }
}
