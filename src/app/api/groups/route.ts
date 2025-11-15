import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import { createGroupSchema, validateRequestBody } from "@/lib/validations";
import { GroupService } from "@/services/group-service";
import { handleApiError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    const groups = await GroupService.getGroups(userId);

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    return handleApiError(error, req);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();

    // Validate request body
    const validatedData = validateRequestBody(createGroupSchema, body);

    const createdGroup = await GroupService.createGroup(
      userId,
      validatedData.name
    );

    return NextResponse.json({ group: createdGroup }, { status: 201 });
  } catch (error) {
    return handleApiError(error, req);
  }
}
