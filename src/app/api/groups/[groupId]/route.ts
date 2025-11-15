import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import { updateGroup, readGroup, deleteGroup } from "../../../../../prisma/db";
import {
  updateGroupSchema,
  groupIdParamSchema,
  validateRequestBody,
  validateParams,
} from "@/lib/validations";
import { rateLimiters } from "@/lib/rate-limit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.general(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const userId = await getUserId();
    const rawParams = await params;

    // Validate route parameters
    const { groupId } = validateParams(groupIdParamSchema, rawParams);

    const body = await req.json();

    // Validate request body
    const validatedData = validateRequestBody(updateGroupSchema, body);

    const group = await readGroup(userId, validatedData.name);

    if (group) {
      return NextResponse.json(
        { error: "Group name already exists." },
        { status: 400 }
      );
    }

    const updatedGroup = await updateGroup(groupId, validatedData.name, userId);

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
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.general(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const userId = await getUserId();
    const rawParams = await params;

    // Validate route parameters
    const { groupId } = validateParams(groupIdParamSchema, rawParams);

    const group = await deleteGroup(groupId, userId);

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
