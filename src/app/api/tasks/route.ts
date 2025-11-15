import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import { createTaskSchema, validateRequestBody } from "@/lib/validations";
import { TaskService } from "@/services/task-service";

export async function GET() {
  try {
    const userId = await getUserId();
    const tasks = await TaskService.getTasks(userId);

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
    const userId = await getUserId();
    const body = await req.json();

    // Validate request body
    const validatedData = validateRequestBody(createTaskSchema, body);

    const createdTask = await TaskService.createTask(userId, {
      title: validatedData.title,
      description: validatedData.description ?? "",
      dueDate: validatedData.dueDate ?? new Date(),
      priority: validatedData.priority,
      groupId: validatedData.groupId,
    });

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

    // Handle business logic errors from service
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while creating task." },
      { status: 500 }
    );
  }
}
