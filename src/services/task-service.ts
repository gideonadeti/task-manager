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
   * Validates that the task title doesn't already exist
   */
  static async createTask(
    userId: string,
    data: {
      title: string;
      description: string;
      priority: "low" | "medium" | "high";
      groupId: string;
      dueDate: Date;
    }
  ): Promise<Task> {
    // Check if task already exists
    const existingTask = await dbReadTask(data.title, userId);
    if (existingTask) {
      throw new Error("Task already exists.");
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
      throw new Error("At least one field must be provided for update.");
    }

    // Fetch existing task to fill in missing fields
    const existingTask = await dbReadTaskById(taskId, userId);
    if (!existingTask) {
      throw new Error("Task not found or you don't have access to this resource.");
    }

    return await dbUpdateTask(
      taskId,
      data.title ?? existingTask.title,
      data.description ?? existingTask.description ?? "",
      data.dueDate ?? existingTask.dueDate ?? new Date(),
      data.priority ?? existingTask.priority,
      data.groupId ?? existingTask.groupId,
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

