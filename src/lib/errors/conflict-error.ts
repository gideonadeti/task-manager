import { AppError } from "./app-error";

/**
 * Error for resource conflicts
 * Used when a resource already exists or conflicts with existing data
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT_ERROR", 409, true);
  }
}

