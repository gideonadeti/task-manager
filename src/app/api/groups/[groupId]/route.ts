import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import {
  updateGroupSchema,
  groupIdParamSchema,
  validateRequestBody,
  validateParams,
} from "@/lib/validations";
import { GroupService } from "@/services/group-service";
import { handleApiError } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const userId = await getUserId();
    const rawParams = await params;

    // Validate route parameters
    const { groupId } = validateParams(groupIdParamSchema, rawParams);

    const body = await req.json();

    // Validate request body
    const validatedData = validateRequestBody(updateGroupSchema, body);

    const updatedGroup = await GroupService.updateGroup(
      userId,
      groupId,
      validatedData.name
    );

    return NextResponse.json({ group: updatedGroup });
  } catch (error) {
    return handleApiError(error, req);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const userId = await getUserId();
    const rawParams = await params;

    // Validate route parameters
    const { groupId } = validateParams(groupIdParamSchema, rawParams);

    const group = await GroupService.deleteGroup(userId, groupId);

    return NextResponse.json({ group });
  } catch (error) {
    return handleApiError(error, req);
  }
}
