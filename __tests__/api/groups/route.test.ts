import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { GET, POST } from "@/app/api/groups/route";
import { GroupService } from "@/services/group-service";
import { getUserId } from "@/lib/auth/get-user-id";
import type { Group } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/auth/get-user-id");
vi.mock("@/services/group-service");
vi.mock("@/lib/validations", () => ({
  createGroupSchema: {
    safeParse: vi.fn(),
  },
  validateRequestBody: vi.fn(),
}));

import { validateRequestBody } from "@/lib/validations";

describe("API Routes - /api/groups", () => {
  const mockUserId = "user-123";

  const mockGroup: Group = {
    id: "group-123",
    name: "Test Group",
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUserId).mockResolvedValue(mockUserId);
  });

  describe("GET /api/groups", () => {
    it("returns all groups for authenticated user", async () => {
      const mockGroups: Group[] = [mockGroup];
      vi.mocked(GroupService.getGroups).mockResolvedValue(mockGroups);

      const req = new NextRequest("http://localhost:3000/api/groups");
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.groups).toHaveLength(mockGroups.length);
      expect(data.groups[0].id).toBe(mockGroups[0].id);
      expect(data.groups[0].name).toBe(mockGroups[0].name);
      expect(GroupService.getGroups).toHaveBeenCalledWith(mockUserId);
    });

    it("handles errors correctly", async () => {
      const error = new Error("Database error");
      vi.mocked(GroupService.getGroups).mockRejectedValue(error);

      const req = new NextRequest("http://localhost:3000/api/groups");
      const response = await GET(req);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("POST /api/groups", () => {
    it("creates a new group successfully", async () => {
      const requestBody = { name: "New Group" };

      vi.mocked(validateRequestBody).mockReturnValue(requestBody);
      vi.mocked(GroupService.createGroup).mockResolvedValue(mockGroup);

      const req = new NextRequest("http://localhost:3000/api/groups", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.group.id).toBe(mockGroup.id);
      expect(data.group.name).toBe(mockGroup.name);
      expect(validateRequestBody).toHaveBeenCalled();
      expect(GroupService.createGroup).toHaveBeenCalledWith(
        mockUserId,
        requestBody.name
      );
    });

    it("handles validation errors", async () => {
      const requestBody = { name: "" }; // Invalid

      const validationError = NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );

      vi.mocked(validateRequestBody).mockImplementation(() => {
        throw validationError;
      });

      const req = new NextRequest("http://localhost:3000/api/groups", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
      expect(GroupService.createGroup).not.toHaveBeenCalled();
    });
  });
});

