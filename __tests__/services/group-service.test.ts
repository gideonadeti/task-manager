import { describe, it, expect, vi, beforeEach } from "vitest";
import { GroupService } from "@/services/group-service";
import { ConflictError } from "@/lib/errors";
import * as dbQueries from "@/lib/db/queries";
import type { Group } from "@prisma/client";

// Mock the database queries
vi.mock("@/lib/db/queries");

describe("GroupService", () => {
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
  });

  describe("getGroups", () => {
    it("returns all groups for a user", async () => {
      const mockGroups: Group[] = [mockGroup];
      vi.mocked(dbQueries.readGroups).mockResolvedValue(mockGroups);

      const result = await GroupService.getGroups(mockUserId);

      expect(result).toEqual(mockGroups);
      expect(dbQueries.readGroups).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("getGroupByName", () => {
    it("returns a group by name", async () => {
      vi.mocked(dbQueries.readGroup).mockResolvedValue(mockGroup);

      const result = await GroupService.getGroupByName(mockUserId, "Test Group");

      expect(result).toEqual(mockGroup);
      expect(dbQueries.readGroup).toHaveBeenCalledWith(mockUserId, "Test Group");
    });

    it("returns null when group not found", async () => {
      vi.mocked(dbQueries.readGroup).mockResolvedValue(null);

      const result = await GroupService.getGroupByName(mockUserId, "Non-existent");

      expect(result).toBeNull();
    });
  });

  describe("createGroup", () => {
    it("creates a new group successfully", async () => {
      vi.mocked(dbQueries.readGroup).mockResolvedValue(null);
      vi.mocked(dbQueries.createGroup).mockResolvedValue(mockGroup);

      const result = await GroupService.createGroup(mockUserId, "Test Group");

      expect(result).toEqual(mockGroup);
      expect(dbQueries.readGroup).toHaveBeenCalledWith(mockUserId, "Test Group");
      expect(dbQueries.createGroup).toHaveBeenCalledWith("Test Group", mockUserId);
    });

    it("throws ConflictError when group with same name already exists", async () => {
      vi.mocked(dbQueries.readGroup).mockResolvedValue(mockGroup);

      await expect(
        GroupService.createGroup(mockUserId, "Test Group")
      ).rejects.toThrow(ConflictError);

      expect(dbQueries.createGroup).not.toHaveBeenCalled();
    });
  });

  describe("updateGroup", () => {
    it("updates a group successfully", async () => {
      const updatedGroup = { ...mockGroup, name: "Updated Group" };
      vi.mocked(dbQueries.readGroup)
        .mockResolvedValueOnce(null) // No existing group with new name
        .mockResolvedValueOnce(mockGroup); // Current group exists
      vi.mocked(dbQueries.updateGroup).mockResolvedValue(updatedGroup);

      const result = await GroupService.updateGroup(
        mockUserId,
        mockGroupId,
        "Updated Group"
      );

      expect(result).toEqual(updatedGroup);
      expect(dbQueries.updateGroup).toHaveBeenCalledWith(
        mockGroupId,
        "Updated Group",
        mockUserId
      );
    });

    it("allows updating to the same name", async () => {
      vi.mocked(dbQueries.readGroup).mockResolvedValue(mockGroup); // Same group found
      vi.mocked(dbQueries.updateGroup).mockResolvedValue(mockGroup);

      const result = await GroupService.updateGroup(
        mockUserId,
        mockGroupId,
        "Test Group"
      );

      expect(result).toEqual(mockGroup);
      expect(dbQueries.updateGroup).toHaveBeenCalledWith(
        mockGroupId,
        "Test Group",
        mockUserId
      );
    });

    it("throws ConflictError when new name already exists for different group", async () => {
      const otherGroup = { ...mockGroup, id: "other-group-id" };
      vi.mocked(dbQueries.readGroup).mockResolvedValue(otherGroup);

      await expect(
        GroupService.updateGroup(mockUserId, mockGroupId, "Existing Group")
      ).rejects.toThrow(ConflictError);

      expect(dbQueries.updateGroup).not.toHaveBeenCalled();
    });
  });

  describe("deleteGroup", () => {
    it("deletes a group successfully", async () => {
      vi.mocked(dbQueries.deleteGroup).mockResolvedValue(mockGroup);

      const result = await GroupService.deleteGroup(mockUserId, mockGroupId);

      expect(result).toEqual(mockGroup);
      expect(dbQueries.deleteGroup).toHaveBeenCalledWith(mockGroupId, mockUserId);
    });
  });
});

