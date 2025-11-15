import { ApiErrorResponse, AxiosErrorResponse } from "@/types";

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
 * Type guard to check if a value matches the API error response structure
 */
export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null || !("error" in value)) {
    return false;
  }

  const errorObj = (value as { error: unknown }).error;
  return (
    typeof errorObj === "object" &&
    errorObj !== null &&
    "message" in errorObj &&
    typeof (errorObj as { message: unknown }).message === "string"
  );
}

/**
 * Type guard to check if a value is an AxiosErrorResponse (legacy format)
 * @deprecated Use isApiErrorResponse instead
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
