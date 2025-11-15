import { describe, it, expect } from "vitest";
import {
  createTaskSchema,
  updateTaskSchema,
  toggleCompleteSchema,
  taskIdParamSchema,
} from "@/lib/validations/task";

describe("Task Validation Schemas", () => {
  describe("createTaskSchema", () => {
    it("validates a valid task creation input", () => {
      const validInput = {
        title: "Test Task",
        description: "Test Description",
        priority: "high" as const,
        groupId: "group-123",
        dueDate: new Date().toISOString(),
      };

      const result = createTaskSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Test Task");
        expect(result.data.priority).toBe("high");
      }
    });

    it("rejects empty title", () => {
      const invalidInput = {
        title: "",
        priority: "medium" as const,
        groupId: "group-123",
      };

      const result = createTaskSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("rejects invalid priority", () => {
      const invalidInput = {
        title: "Test Task",
        priority: "invalid" as any,
        groupId: "group-123",
      };

      const result = createTaskSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("rejects empty groupId", () => {
      const invalidInput = {
        title: "Test Task",
        priority: "medium" as const,
        groupId: "",
      };

      const result = createTaskSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe("updateTaskSchema", () => {
    it("allows partial updates", () => {
      const partialInput = {
        title: "Updated Task",
      };

      const result = updateTaskSchema.safeParse(partialInput);
      expect(result.success).toBe(true);
    });

    it("rejects invalid priority in update", () => {
      const invalidInput = {
        priority: "invalid" as any,
      };

      const result = updateTaskSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe("toggleCompleteSchema", () => {
    it("validates boolean previousStatus", () => {
      expect(toggleCompleteSchema.safeParse({ previousStatus: true }).success).toBe(true);
      expect(toggleCompleteSchema.safeParse({ previousStatus: false }).success).toBe(true);
      expect(toggleCompleteSchema.safeParse({}).success).toBe(false);
      expect(toggleCompleteSchema.safeParse({ previousStatus: "true" }).success).toBe(false);
    });
  });

  describe("taskIdParamSchema", () => {
    it("validates task ID parameter", () => {
      expect(taskIdParamSchema.safeParse({ taskId: "task-123" }).success).toBe(true);
      expect(taskIdParamSchema.safeParse({ taskId: "" }).success).toBe(false);
      expect(taskIdParamSchema.safeParse({}).success).toBe(false);
    });
  });
});

