import { AppError } from "./app-error";

/**
 * Error for resource not found
 * Used when a requested resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(
    resource: string = "Resource",
    identifier?: string
  ) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found.`
      : `${resource} not found.`;
    super(message, "NOT_FOUND_ERROR", 404, true);
  }
}

