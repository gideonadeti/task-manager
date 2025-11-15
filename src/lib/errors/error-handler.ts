import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./app-error";
import { logger } from "../logger";

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Handle errors in API routes
 */
export function handleApiError(
  error: unknown,
  request?: NextRequest
): NextResponse<ErrorResponse> {
  // Handle NextResponse (from validation functions)
  if (error instanceof NextResponse) {
    return error;
  }

  // Handle custom AppError instances
  if (error instanceof AppError) {
    logger.error(`[${error.code}] ${error.message}`, error, {
      path: request?.nextUrl.pathname,
    });

    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle unknown errors
  logger.error("Unhandled error", error instanceof Error ? error : new Error(String(error)), {
    path: request?.nextUrl.pathname,
  });

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
    },
    { status: 500 }
  );
}

