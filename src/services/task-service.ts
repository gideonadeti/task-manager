import {
  readTasks as dbReadTasks,
  createTask as dbCreateTask,
  readTask as dbReadTask,
  readTaskById as dbReadTaskById,
  updateTask as dbUpdateTask,
  deleteTask as dbDeleteTask,
  toggleComplete as dbToggleComplete,
} from "@/lib/db/queries";
import { Task } from "@prisma/client";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";

export class TaskService {
  /**
   * Get all tasks for a user
   */
  static async getTasks(userId: string): Promise<Task[]> {
    return await dbReadTasks(userId);
  }

  /**
   * Get a task by title for a user
   */
  static async getTaskByTitle(userId: string, title: string): Promise<Task | null> {
    return await dbReadTask(title, userId);
  }

  /**
   * Get a task by ID for a user
   */
  static async getTaskById(userId: string, taskId: string): Promise<Task | null> {
    return await dbReadTaskById(taskId, userId);
  }

  /**
   * Create a new task
   * Validates that the task title doesn't already exist in the same group
   */
  static async createTask(
    userId: string,
    data: {
      title: string;
      description: string;
      priority: "low" | "medium" | "high";
      groupId: string;
      dueDate?: Date | null;
    }
  ): Promise<Task> {
    // Check if task already exists in the same group
    const existingTask = await dbReadTask(data.title, userId, data.groupId);
    if (existingTask) {
      throw new ConflictError("Task already exists in this group.");
    }

    return await dbCreateTask(
      data.title,
      data.description,
      data.dueDate,
      data.priority,
      data.groupId,
      userId
    );
  }

  /**
   * Update a task
   * Validates that the task belongs to the user
   * Validates that the task title doesn't already exist in the target group
   * Merges provided fields with existing task data
   */
  static async updateTask(
    userId: string,
    taskId: string,
    data: {
      title?: string;
      description?: string;
      priority?: "low" | "medium" | "high";
      groupId?: string;
      dueDate?: Date;
    }
  ): Promise<Task> {
    // Ensure at least one field is provided
    if (
      !data.title &&
      !data.description &&
      !data.priority &&
      !data.groupId &&
      !data.dueDate
    ) {
      throw new ValidationError("At least one field must be provided for update.");
    }

    // Fetch existing task to fill in missing fields
    const existingTask = await dbReadTaskById(taskId, userId);
    if (!existingTask) {
      throw new NotFoundError("Task", taskId);
    }

    // Determine the target group (new groupId if provided, otherwise existing)
    const targetGroupId = data.groupId ?? existingTask.groupId;
    const newTitle = data.title ?? existingTask.title;
    const isTitleChanging = data.title && data.title !== existingTask.title;
    const isGroupChanging = data.groupId && data.groupId !== existingTask.groupId;

    // If title or group is being changed, check if the new title already exists in the target group
    // (excluding the current task)
    if (isTitleChanging || isGroupChanging) {
      const existingTaskWithSameName = await dbReadTask(
        newTitle,
        userId,
        targetGroupId
      );
      // If found a task with the same name in the same group, and it's not the current task
      if (existingTaskWithSameName && existingTaskWithSameName.id !== taskId) {
        throw new ConflictError("Task with this name already exists in this group.");
      }
    }

    return await dbUpdateTask(
      taskId,
      newTitle,
      data.description ?? existingTask.description ?? "",
      data.dueDate !== undefined ? data.dueDate : existingTask.dueDate,
      data.priority ?? existingTask.priority,
      targetGroupId,
      userId
    );
  }

  /**
   * Delete a task
   * Validates that the task belongs to the user
   */
  static async deleteTask(userId: string, taskId: string): Promise<Task> {
    return await dbDeleteTask(taskId, userId);
  }

  /**
   * Toggle task completion status
   * Validates that the task belongs to the user
   */
  static async toggleComplete(
    userId: string,
    taskId: string,
    previousStatus: boolean
  ): Promise<Task> {
    return await dbToggleComplete(taskId, previousStatus, userId);
  }
}

