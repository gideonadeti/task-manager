import { AppError } from "./app-error";

/**
 * Error for authorization failures
 * Used when user doesn't have permission to access a resource
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Forbidden. You don't have access to this resource.") {
    super(message, "AUTHORIZATION_ERROR", 403, true);
  }
}

