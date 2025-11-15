import { AppError } from "./app-error";

/**
 * Error for validation failures
 */
export class ValidationError extends AppError {
  constructor(
    message: string = "Validation failed",
    details?: Array<{ field: string; message: string }>
  ) {
    super(message, "VALIDATION_ERROR", 400, true, details);
  }
}

