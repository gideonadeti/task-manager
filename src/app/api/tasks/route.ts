import { NextRequest, NextResponse } from "next/server";

import { readTasks, createTask, readTask } from "../../../../prisma/db";
import { getUserId } from "@/lib/auth/get-user-id";
import { rateLimiters } from "@/lib/rate-limit";
import { createTaskSchema, validateRequestBody } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.general(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const userId = await getUserId();
    const tasks = await readTasks(userId);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error(error);

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

    return NextResponse.json(
      { error: "Something went wrong while reading tasks." },
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
    const validatedData = validateRequestBody(createTaskSchema, body);

    const task = await readTask(validatedData.title, userId);

    if (task) {
      return NextResponse.json(
        { error: "Task already exists." },
        { status: 400 }
      );
    }

    const createdTask = await createTask(
      validatedData.title,
      validatedData.description ?? "",
      validatedData.dueDate ?? new Date(),
      validatedData.priority,
      validatedData.groupId,
      userId
    );

    return NextResponse.json({ task: createdTask }, { status: 201 });
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
      { error: "Something went wrong while creating task." },
      { status: 500 }
    );
  }
}
