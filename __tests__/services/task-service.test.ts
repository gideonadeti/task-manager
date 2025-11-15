import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskService } from "@/services/task-service";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";
import * as dbQueries from "@/lib/db/queries";
import type { Task } from "@prisma/client";

// Mock the database queries
vi.mock("@/lib/db/queries");

describe("TaskService", () => {
  const mockUserId = "user-123";
  const mockGroupId = "group-123";
  const mockTaskId = "task-123";

  const mockTask: Task = {
    id: mockTaskId,
    title: "Test Task",
    description: "Test Description",
    priority: "medium",
    dueDate: new Date(),
    completed: false,
    groupId: mockGroupId,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTasks", () => {
    it("returns all tasks for a user", async () => {
      const mockTasks: Task[] = [mockTask];
      vi.mocked(dbQueries.readTasks).mockResolvedValue(mockTasks);

      const result = await TaskService.getTasks(mockUserId);

      expect(result).toEqual(mockTasks);
      expect(dbQueries.readTasks).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("getTaskByTitle", () => {
    it("returns a task by title", async () => {
      vi.mocked(dbQueries.readTask).mockResolvedValue(mockTask);

      const result = await TaskService.getTaskByTitle(mockUserId, "Test Task");

      expect(result).toEqual(mockTask);
      expect(dbQueries.readTask).toHaveBeenCalledWith("Test Task", mockUserId);
    });

    it("returns null when task not found", async () => {
      vi.mocked(dbQueries.readTask).mockResolvedValue(null);

      const result = await TaskService.getTaskByTitle(mockUserId, "Non-existent");

      expect(result).toBeNull();
    });
  });

  describe("getTaskById", () => {
    it("returns a task by ID", async () => {
      vi.mocked(dbQueries.readTaskById).mockResolvedValue(mockTask);

      const result = await TaskService.getTaskById(mockUserId, mockTaskId);

      expect(result).toEqual(mockTask);
      expect(dbQueries.readTaskById).toHaveBeenCalledWith(mockTaskId, mockUserId);
    });

    it("returns null when task not found", async () => {
      vi.mocked(dbQueries.readTaskById).mockResolvedValue(null);

      const result = await TaskService.getTaskById(mockUserId, "non-existent");

      expect(result).toBeNull();
    });
  });

  describe("createTask", () => {
    const createTaskData = {
      title: "New Task",
      description: "New Description",
      priority: "high" as const,
      groupId: mockGroupId,
      dueDate: new Date(),
    };

    it("creates a new task successfully", async () => {
      vi.mocked(dbQueries.readTask).mockResolvedValue(null);
      vi.mocked(dbQueries.createTask).mockResolvedValue(mockTask);

      const result = await TaskService.createTask(mockUserId, createTaskData);

      expect(result).toEqual(mockTask);
      expect(dbQueries.readTask).toHaveBeenCalledWith(createTaskData.title, mockUserId);
      expect(dbQueries.createTask).toHaveBeenCalledWith(
        createTaskData.title,
        createTaskData.description,
        createTaskData.dueDate,
        createTaskData.priority,
        createTaskData.groupId,
        mockUserId
      );
    });

    it("throws ConflictError when task with same title already exists", async () => {
      vi.mocked(dbQueries.readTask).mockResolvedValue(mockTask);

      await expect(
        TaskService.createTask(mockUserId, createTaskData)
      ).rejects.toThrow(ConflictError);

      expect(dbQueries.createTask).not.toHaveBeenCalled();
    });
  });

  describe("updateTask", () => {
    const updateData = {
      title: "Updated Task",
    };

    it("updates a task successfully", async () => {
      const updatedTask = { ...mockTask, title: "Updated Task" };
      vi.mocked(dbQueries.readTaskById).mockResolvedValue(mockTask);
      vi.mocked(dbQueries.updateTask).mockResolvedValue(updatedTask);

      const result = await TaskService.updateTask(mockUserId, mockTaskId, updateData);

      expect(result).toEqual(updatedTask);
      expect(dbQueries.readTaskById).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(dbQueries.updateTask).toHaveBeenCalledWith(
        mockTaskId,
        updateData.title,
        mockTask.description ?? "",
        mockTask.dueDate ?? expect.any(Date),
        mockTask.priority,
        mockTask.groupId,
        mockUserId
      );
    });

    it("merges partial updates with existing task data", async () => {
      const updatedTask = { ...mockTask, priority: "high" as const };
      vi.mocked(dbQueries.readTaskById).mockResolvedValue(mockTask);
      vi.mocked(dbQueries.updateTask).mockResolvedValue(updatedTask);

      const result = await TaskService.updateTask(mockUserId, mockTaskId, {
        priority: "high",
      });

      expect(result).toEqual(updatedTask);
      expect(dbQueries.updateTask).toHaveBeenCalledWith(
        mockTaskId,
        mockTask.title,
        mockTask.description ?? "",
        mockTask.dueDate ?? expect.any(Date),
        "high",
        mockTask.groupId,
        mockUserId
      );
    });

    it("throws ValidationError when no fields are provided", async () => {
      await expect(
        TaskService.updateTask(mockUserId, mockTaskId, {})
      ).rejects.toThrow(ValidationError);

      expect(dbQueries.updateTask).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when task does not exist", async () => {
      vi.mocked(dbQueries.readTaskById).mockResolvedValue(null);

      await expect(
        TaskService.updateTask(mockUserId, mockTaskId, updateData)
      ).rejects.toThrow(NotFoundError);

      expect(dbQueries.updateTask).not.toHaveBeenCalled();
    });
  });

  describe("deleteTask", () => {
    it("deletes a task successfully", async () => {
      vi.mocked(dbQueries.deleteTask).mockResolvedValue(mockTask);

      const result = await TaskService.deleteTask(mockUserId, mockTaskId);

      expect(result).toEqual(mockTask);
      expect(dbQueries.deleteTask).toHaveBeenCalledWith(mockTaskId, mockUserId);
    });
  });

  describe("toggleComplete", () => {
    it("toggles task completion status", async () => {
      const completedTask = { ...mockTask, completed: true };
      vi.mocked(dbQueries.toggleComplete).mockResolvedValue(completedTask);

      const result = await TaskService.toggleComplete(mockUserId, mockTaskId, false);

      expect(result).toEqual(completedTask);
      expect(dbQueries.toggleComplete).toHaveBeenCalledWith(
        mockTaskId,
        false,
        mockUserId
      );
    });

    it("toggles from completed to incomplete", async () => {
      const incompleteTask = { ...mockTask, completed: false };
      vi.mocked(dbQueries.toggleComplete).mockResolvedValue(incompleteTask);

      const result = await TaskService.toggleComplete(mockUserId, mockTaskId, true);

      expect(result).toEqual(incompleteTask);
      expect(dbQueries.toggleComplete).toHaveBeenCalledWith(
        mockTaskId,
        true,
        mockUserId
      );
    });
  });
});

