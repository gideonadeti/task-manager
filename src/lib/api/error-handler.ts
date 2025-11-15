import { toast } from "sonner";
import { hasAxiosResponse, isAxiosErrorResponse } from "@/lib/type-guards";

/**
 * Handles API errors and shows appropriate toast notifications
 * @param error - The error to handle (typically an AxiosError)
 * @param defaultMessage - Optional default error message (defaults to "Something went wrong")
 */
export function handleApiError(
  error: unknown,
  defaultMessage: string = "Something went wrong"
): void {
  let description = defaultMessage;

  if (hasAxiosResponse(error) && error.response?.data) {
    if (isAxiosErrorResponse(error.response.data)) {
      description = error.response.data.error;
    }
  }

  toast.error(description);
}
