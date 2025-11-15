import {
  readGroups as dbReadGroups,
  createGroup as dbCreateGroup,
  readGroup as dbReadGroup,
  updateGroup as dbUpdateGroup,
  deleteGroup as dbDeleteGroup,
} from "@/lib/db/queries";
import { Group } from "@prisma/client";

export class GroupService {
  /**
   * Get all groups for a user
   */
  static async getGroups(userId: string): Promise<Group[]> {
    return await dbReadGroups(userId);
  }

  /**
   * Get a group by name for a user
   */
  static async getGroupByName(userId: string, name: string): Promise<Group | null> {
    return await dbReadGroup(userId, name);
  }

  /**
   * Create a new group
   * Validates that the group name doesn't already exist
   */
  static async createGroup(userId: string, name: string): Promise<Group> {
    // Check if group already exists
    const existingGroup = await dbReadGroup(userId, name);
    if (existingGroup) {
      throw new Error("Group already exists.");
    }

    return await dbCreateGroup(name, userId);
  }

  /**
   * Update a group
   * Validates that the group belongs to the user and the new name doesn't exist
   */
  static async updateGroup(
    userId: string,
    groupId: string,
    name: string
  ): Promise<Group> {
    // Check if new name already exists (excluding current group)
    const existingGroup = await dbReadGroup(userId, name);
    if (existingGroup && existingGroup.id !== groupId) {
      throw new Error("Group name already exists.");
    }

    return await dbUpdateGroup(groupId, name, userId);
  }

  /**
   * Delete a group
   * Validates that the group belongs to the user
   */
  static async deleteGroup(userId: string, groupId: string): Promise<Group> {
    return await dbDeleteGroup(groupId, userId);
  }
}

