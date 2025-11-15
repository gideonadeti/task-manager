import { z } from "zod";

// Group name validation - min 1 char, max 100 chars, trimmed
const groupNameSchema = z
  .string()
  .min(1, "Group name is required")
  .max(100, "Group name must be 100 characters or less")
  .trim();

// Create group schema
export const createGroupSchema = z.object({
  name: groupNameSchema,
});

// Update group schema
export const updateGroupSchema = z.object({
  name: groupNameSchema,
});

// Group ID parameter schema
export const groupIdParamSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
});

// Type exports
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;

