import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { PUT, DELETE, PATCH } from "@/app/api/tasks/[taskId]/route";
import { TaskService } from "@/services/task-service";
import { getUserId } from "@/lib/auth/get-user-id";
import type { Task } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/auth/get-user-id");
vi.mock("@/services/task-service");
vi.mock("@/lib/validations", () => ({
  updateTaskSchema: {
    safeParse: vi.fn(),
  },
  taskIdParamSchema: {
    safeParse: vi.fn(),
  },
  toggleCompleteSchema: {
    safeParse: vi.fn(),
  },
  validateRequestBody: vi.fn(),
  validateParams: vi.fn(),
}));

import { validateRequestBody, validateParams } from "@/lib/validations";

describe("API Routes - /api/tasks/[taskId]", () => {
  const mockUserId = "user-123";
  const mockTaskId = "task-123";
  const mockGroupId = "group-123";

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
    vi.mocked(getUserId).mockResolvedValue(mockUserId);
    vi.mocked(validateParams).mockReturnValue({ taskId: mockTaskId });
  });

  describe("PUT /api/tasks/[taskId]", () => {
    it("updates a task successfully", async () => {
      const requestBody = {
        title: "Updated Task",
        priority: "high" as const,
      };

      const updatedTask = { ...mockTask, ...requestBody };

      vi.mocked(validateRequestBody).mockReturnValue(requestBody);
      vi.mocked(TaskService.updateTask).mockResolvedValue(updatedTask);

      const req = new NextRequest(
        `http://localhost:3000/api/tasks/${mockTaskId}`,
        {
          method: "PUT",
          body: JSON.stringify(requestBody),
        }
      );

      const params = Promise.resolve({ taskId: mockTaskId });
      const response = await PUT(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.task.id).toBe(updatedTask.id);
      expect(data.task.title).toBe(updatedTask.title);
      expect(validateParams).toHaveBeenCalled();
      expect(validateRequestBody).toHaveBeenCalled();
      expect(TaskService.updateTask).toHaveBeenCalledWith(
        mockUserId,
        mockTaskId,
        requestBody
      );
    });

    it("handles validation errors", async () => {
      const validationError = NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );

      vi.mocked(validateParams).mockImplementation(() => {
        throw validationError;
      });

      const req = new NextRequest(
        `http://localhost:3000/api/tasks/${mockTaskId}`,
        {
          method: "PUT",
        }
      );

      const params = Promise.resolve({ taskId: mockTaskId });
      const response = await PUT(req, { params });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/tasks/[taskId]", () => {
    it("deletes a task successfully", async () => {
      vi.mocked(TaskService.deleteTask).mockResolvedValue(mockTask);

      const req = new NextRequest(
        `http://localhost:3000/api/tasks/${mockTaskId}`,
        {
          method: "DELETE",
        }
      );

      const params = Promise.resolve({ taskId: mockTaskId });
      const response = await DELETE(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.task.id).toBe(mockTask.id);
      expect(data.task.title).toBe(mockTask.title);
      expect(validateParams).toHaveBeenCalled();
      expect(TaskService.deleteTask).toHaveBeenCalledWith(
        mockUserId,
        mockTaskId
      );
    });
  });

  describe("PATCH /api/tasks/[taskId]", () => {
    it("toggles task completion successfully", async () => {
      const requestBody = { previousStatus: false };
      const completedTask = { ...mockTask, completed: true };

      vi.mocked(validateRequestBody).mockReturnValue(requestBody);
      vi.mocked(TaskService.toggleComplete).mockResolvedValue(completedTask);

      const req = new NextRequest(
        `http://localhost:3000/api/tasks/${mockTaskId}`,
        {
          method: "PATCH",
          body: JSON.stringify(requestBody),
        }
      );

      const params = Promise.resolve({ taskId: mockTaskId });
      const response = await PATCH(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Task status updated successfully.");
      expect(TaskService.toggleComplete).toHaveBeenCalledWith(
        mockUserId,
        mockTaskId,
        false
      );
    });
  });
});
