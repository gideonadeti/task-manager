import { AxiosErrorResponse } from "@/types";

/**
 * Type guard to check if an error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type guard to check if an error has a response property (Axios error)
 */
export function hasAxiosResponse(
  error: unknown
): error is { response?: { data?: unknown } } {
  return (
    typeof error === "object" &&
    error !== null &&
    ("response" in error || "data" in error)
  );
}

/**
 * Type guard to check if a value is an AxiosErrorResponse
 */
export function isAxiosErrorResponse(
  value: unknown
): value is AxiosErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as AxiosErrorResponse).error === "string"
  );
}

