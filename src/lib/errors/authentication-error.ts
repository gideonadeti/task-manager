import { AppError } from "./app-error";

/**
 * Error for authentication failures
 * Used when user is not authenticated
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Unauthorized. Authentication required.") {
    super(message, "AUTHENTICATION_ERROR", 401, true);
  }
}

