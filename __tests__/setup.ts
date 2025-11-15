import { afterEach, vi } from "vitest";

// Mock Clerk authentication for server-side usage
// This is needed because getUserId() uses auth() from @clerk/nextjs/server
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(() => Promise.resolve({ userId: "test-user-id" })),
  clerkMiddleware: vi.fn(() => vi.fn()),
}));

// Clear all mocks after each test to ensure test isolation
afterEach(() => {
  vi.clearAllMocks();
});
