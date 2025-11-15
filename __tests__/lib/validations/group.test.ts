import { describe, it, expect } from "vitest";
import {
  createGroupSchema,
  updateGroupSchema,
  groupIdParamSchema,
} from "@/lib/validations/group";

describe("Group Validation Schemas", () => {
  describe("createGroupSchema", () => {
    it("validates a valid group creation input", () => {
      const validInput = {
        name: "Test Group",
      };

      const result = createGroupSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Test Group");
      }
    });

    it("rejects empty name", () => {
      const invalidInput = {
        name: "",
      };

      const result = createGroupSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("rejects missing name", () => {
      const result = createGroupSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("updateGroupSchema", () => {
    it("validates a valid group update input", () => {
      const validInput = {
        name: "Updated Group",
      };

      const result = updateGroupSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Updated Group");
      }
    });

    it("rejects empty name in update", () => {
      const invalidInput = {
        name: "",
      };

      const result = updateGroupSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe("groupIdParamSchema", () => {
    it("validates group ID parameter", () => {
      expect(groupIdParamSchema.safeParse({ groupId: "group-123" }).success).toBe(true);
      expect(groupIdParamSchema.safeParse({ groupId: "" }).success).toBe(false);
      expect(groupIdParamSchema.safeParse({}).success).toBe(false);
    });
  });
});

