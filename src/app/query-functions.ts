import axios from "axios";

export async function readGroups(userId: string) {
  try {
    const response = await axios.get("/api/groups", {
      params: { userId },
    });

    return response.data.groups;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export async function createGroup(name: string, userId: string) {
  try {
    const response = await axios.post("/api/groups", {
      name,
      userId,
    });

    return response.data.message;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export async function readTasks(userId: string) {
  try {
    const response = await axios.get("/api/tasks", {
      params: { userId },
    });

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

    return response.data.message;
  } catch (error) {
    console.error(error);

    throw error;
  }
}
