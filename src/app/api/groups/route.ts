import { NextRequest, NextResponse } from "next/server";

import { readGroups, createGroup, readGroup } from "../../../../prisma/db";
import { getUserId } from "@/lib/auth/get-user-id";
import { createGroupSchema, validateRequestBody } from "@/lib/validations";
import { rateLimiters } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.general(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const userId = await getUserId();
    const groups = await readGroups(userId);

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
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.general(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const userId = await getUserId();
    const body = await req.json();

    // Validate request body
    const validatedData = validateRequestBody(createGroupSchema, body);

    const group = await readGroup(userId, validatedData.name);

    if (group) {
      return NextResponse.json(
        { error: "Group already exists." },
        { status: 400 }
      );
    }

    const createdGroup = await createGroup(validatedData.name, userId);

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

    return NextResponse.json(
      { error: "Something went wrong while creating group." },
      { status: 500 }
    );
  }
}
