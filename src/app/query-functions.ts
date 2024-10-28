import axios from "axios";

export async function fetchGroups(userId: string) {
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
