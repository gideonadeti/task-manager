import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import {
  updateGroupSchema,
  groupIdParamSchema,
  validateRequestBody,
  validateParams,
} from "@/lib/validations";
import { GroupService } from "@/services/group-service";

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
    console.error("Error updating group name:", error);

    // Handle validation errors (NextResponse thrown by validate functions)
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required." },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Forbidden. You don't have access to this resource." },
        { status: 403 }
      );
    }

    // Handle business logic errors from service
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while updating group name." },
      { status: 500 }
    );
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
  } catch (error: unknown) {
    console.error("Error deleting group:", error);

    // Handle validation errors (NextResponse thrown by validate functions)
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required." },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Forbidden. You don't have access to this resource." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while deleting group." },
      { status: 500 }
    );
  }
}
