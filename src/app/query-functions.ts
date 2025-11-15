import axios from "axios";

export async function readGroups() {
  try {
    const response = await axios.get("/api/groups");

    return response.data.groups;
  } catch (error) {
    console.error(error);

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
    console.error(error);

    throw error;
  }
}

export async function readTasks() {
  try {
    const response = await axios.get("/api/tasks");

    return response.data.tasks;
  } catch (error) {
    console.error(error);

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
    console.error(error);

    throw error;
  }
}

export async function deleteGroup(groupId: string) {
  try {
    const response = await axios.delete(`/api/groups/${groupId}`);

    return response.data.group;
  } catch (error) {
    console.error(error);

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
    console.error(error);

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
    console.error(error);

    throw error;
  }
}

export async function deleteTask(taskId: string) {
  try {
    const response = await axios.delete(`/api/tasks/${taskId}`);

    return response.data.task;
  } catch (error) {
    console.error(error);

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
    console.error(error);

    throw error;
  }
}
