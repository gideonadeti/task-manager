import { z } from "zod";

// Priority enum
const priorityEnum = z.enum(["low", "medium", "high"], {
  errorMap: () => ({ message: "Priority must be low, medium, or high" }),
});

// Task title validation - min 1 char, max 200 chars, trimmed
const taskTitleSchema = z
  .string()
  .min(1, "Task title is required")
  .max(200, "Task title must be 200 characters or less")
  .trim();

// Task description validation - optional, max 1000 chars, trimmed
const taskDescriptionSchema = z
  .string()
  .max(1000, "Description must be 1000 characters or less")
  .trim()
  .optional();

// Group ID validation
const groupIdSchema = z.string().min(1, "Group ID is required");

// Date validation - must be a valid date string or Date object
const dateSchema = z
  .union([z.string().datetime(), z.date(), z.string()])
  .refine(
    (val) => {
      const date = val instanceof Date ? val : new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date format" }
  )
  .transform((val) => (val instanceof Date ? val : new Date(val)))
  .optional();

// Create task schema
export const createTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  priority: priorityEnum,
  groupId: groupIdSchema,
  dueDate: dateSchema,
});

// Update task schema
export const updateTaskSchema = z.object({
  title: taskTitleSchema.optional(),
  description: taskDescriptionSchema,
  priority: priorityEnum.optional(),
  groupId: groupIdSchema.optional(),
  dueDate: dateSchema,
});

// Toggle complete schema
export const toggleCompleteSchema = z.object({
  previousStatus: z.boolean({
    required_error: "previousStatus is required",
    invalid_type_error: "previousStatus must be a boolean",
  }),
});

// Task ID parameter schema
export const taskIdParamSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
});

// Type exports
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ToggleCompleteInput = z.infer<typeof toggleCompleteSchema>;

