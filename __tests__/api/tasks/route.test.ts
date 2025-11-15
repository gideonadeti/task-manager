import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { GET, POST } from "@/app/api/tasks/route";
import { TaskService } from "@/services/task-service";
import { getUserId } from "@/lib/auth/get-user-id";
import type { Task } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/auth/get-user-id");
vi.mock("@/services/task-service");
vi.mock("@/lib/validations", () => ({
  createTaskSchema: {
    safeParse: vi.fn(),
  },
  validateRequestBody: vi.fn(),
}));

import { validateRequestBody } from "@/lib/validations";

describe("API Routes - /api/tasks", () => {
  const mockUserId = "user-123";
  const mockGroupId = "group-123";

  const mockTask: Task = {
    id: "task-123",
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
  });

  describe("GET /api/tasks", () => {
    it("returns all tasks for authenticated user", async () => {
      const mockTasks: Task[] = [mockTask];
      vi.mocked(TaskService.getTasks).mockResolvedValue(mockTasks);

      const req = new NextRequest("http://localhost:3000/api/tasks");
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toHaveLength(mockTasks.length);
      expect(data.tasks[0].id).toBe(mockTasks[0].id);
      expect(data.tasks[0].title).toBe(mockTasks[0].title);
      expect(TaskService.getTasks).toHaveBeenCalledWith(mockUserId);
    });

    it("handles errors correctly", async () => {
      const error = new Error("Database error");
      vi.mocked(TaskService.getTasks).mockRejectedValue(error);

      const req = new NextRequest("http://localhost:3000/api/tasks");
      const response = await GET(req);

      // Error handler should return appropriate status
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("POST /api/tasks", () => {
    it("creates a new task successfully", async () => {
      const requestBody = {
        title: "New Task",
        description: "New Description",
        priority: "high" as const,
        groupId: mockGroupId,
        dueDate: new Date().toISOString(),
      };

      const validatedData = {
        ...requestBody,
        dueDate: new Date(requestBody.dueDate),
      };

      vi.mocked(validateRequestBody).mockReturnValue(validatedData);
      vi.mocked(TaskService.createTask).mockResolvedValue(mockTask);

      const req = new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.task.id).toBe(mockTask.id);
      expect(data.task.title).toBe(mockTask.title);
      expect(validateRequestBody).toHaveBeenCalled();
      expect(TaskService.createTask).toHaveBeenCalledWith(mockUserId, {
        title: validatedData.title,
        description: validatedData.description ?? "",
        dueDate: validatedData.dueDate ?? expect.any(Date),
        priority: validatedData.priority,
        groupId: validatedData.groupId,
      });
    });

    it("handles validation errors", async () => {
      const requestBody = { title: "" }; // Invalid

      const validationError = NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );

      vi.mocked(validateRequestBody).mockImplementation(() => {
        throw validationError;
      });

      const req = new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
      expect(TaskService.createTask).not.toHaveBeenCalled();
    });

    it("handles service errors", async () => {
      const requestBody = {
        title: "New Task",
        priority: "high" as const,
        groupId: mockGroupId,
      };

      vi.mocked(validateRequestBody).mockReturnValue(requestBody);
      vi.mocked(TaskService.createTask).mockRejectedValue(
        new Error("Service error")
      );

      const req = new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const response = await POST(req);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});

