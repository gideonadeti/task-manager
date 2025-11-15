import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import { createGroupSchema, validateRequestBody } from "@/lib/validations";
import { GroupService } from "@/services/group-service";

export async function GET() {
  try {
    const userId = await getUserId();
    const groups = await GroupService.getGroups(userId);

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error(error);

    // Handle validation errors (NextResponse thrown by validateRequestBody)
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while reading groups." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();

    // Validate request body
    const validatedData = validateRequestBody(createGroupSchema, body);

    const createdGroup = await GroupService.createGroup(userId, validatedData.name);

    return NextResponse.json({ group: createdGroup }, { status: 201 });
  } catch (error) {
    console.error(error);

    // Handle validation errors (NextResponse thrown by validateRequestBody)
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required." },
        { status: 401 }
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
      { error: "Something went wrong while creating group." },
      { status: 500 }
    );
  }
}
