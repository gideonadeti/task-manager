import { auth } from "@clerk/nextjs/server";

/**
 * Extracts the authenticated user ID from Clerk auth token
 * @returns The user ID if authenticated
 * @throws Error if user is not authenticated
 */
export async function getUserId(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized. Authentication required.");
  }

  return userId;
}

