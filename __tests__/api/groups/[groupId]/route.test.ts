import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { PATCH, DELETE } from "@/app/api/groups/[groupId]/route";
import { GroupService } from "@/services/group-service";
import { getUserId } from "@/lib/auth/get-user-id";
import type { Group } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/auth/get-user-id");
vi.mock("@/services/group-service");
vi.mock("@/lib/validations", () => ({
  updateGroupSchema: {
    safeParse: vi.fn(),
  },
  groupIdParamSchema: {
    safeParse: vi.fn(),
  },
  validateRequestBody: vi.fn(),
  validateParams: vi.fn(),
}));

import { validateRequestBody, validateParams } from "@/lib/validations";

describe("API Routes - /api/groups/[groupId]", () => {
  const mockUserId = "user-123";
  const mockGroupId = "group-123";

  const mockGroup: Group = {
    id: mockGroupId,
    name: "Test Group",
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUserId).mockResolvedValue(mockUserId);
    vi.mocked(validateParams).mockReturnValue({ groupId: mockGroupId });
  });

  describe("PATCH /api/groups/[groupId]", () => {
    it("updates a group successfully", async () => {
      const requestBody = { name: "Updated Group" };
      const updatedGroup = { ...mockGroup, name: "Updated Group" };

      vi.mocked(validateRequestBody).mockReturnValue(requestBody);
      vi.mocked(GroupService.updateGroup).mockResolvedValue(updatedGroup);

      const req = new NextRequest(
        `http://localhost:3000/api/groups/${mockGroupId}`,
        {
          method: "PATCH",
          body: JSON.stringify(requestBody),
        }
      );

      const params = Promise.resolve({ groupId: mockGroupId });
      const response = await PATCH(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.group.id).toBe(updatedGroup.id);
      expect(data.group.name).toBe(updatedGroup.name);
      expect(validateParams).toHaveBeenCalled();
      expect(validateRequestBody).toHaveBeenCalled();
      expect(GroupService.updateGroup).toHaveBeenCalledWith(
        mockUserId,
        mockGroupId,
        requestBody.name
      );
    });

    it("handles validation errors", async () => {
      const validationError = NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );

      vi.mocked(validateParams).mockImplementation(() => {
        throw validationError;
      });

      const req = new NextRequest(
        `http://localhost:3000/api/groups/${mockGroupId}`,
        {
          method: "PATCH",
        }
      );

      const params = Promise.resolve({ groupId: mockGroupId });
      const response = await PATCH(req, { params });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/groups/[groupId]", () => {
    it("deletes a group successfully", async () => {
      vi.mocked(GroupService.deleteGroup).mockResolvedValue(mockGroup);

      const req = new NextRequest(
        `http://localhost:3000/api/groups/${mockGroupId}`,
        {
          method: "DELETE",
        }
      );

      const params = Promise.resolve({ groupId: mockGroupId });
      const response = await DELETE(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.group.id).toBe(mockGroup.id);
      expect(data.group.name).toBe(mockGroup.name);
      expect(validateParams).toHaveBeenCalled();
      expect(GroupService.deleteGroup).toHaveBeenCalledWith(
        mockUserId,
        mockGroupId
      );
    });
  });
});
