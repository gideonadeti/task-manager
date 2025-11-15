import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import {
  updateTaskSchema,
  taskIdParamSchema,
  toggleCompleteSchema,
  validateRequestBody,
  validateParams,
} from "@/lib/validations";
import { TaskService } from "@/services/task-service";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const userId = await getUserId();
    const rawParams = await params;

    // Validate route parameters
    const { taskId } = validateParams(taskIdParamSchema, rawParams);

    const body = await req.json();

    // Validate request body
    const validatedData = validateRequestBody(updateTaskSchema, body);

    const task = await TaskService.updateTask(userId, taskId, {
      title: validatedData.title,
      description: validatedData.description,
      priority: validatedData.priority,
      groupId: validatedData.groupId,
      dueDate: validatedData.dueDate,
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error updating task:", error);

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
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes("must be provided")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while updating task." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ taskId: string }>;
  }
) {
  try {
    const userId = await getUserId();
    const rawParams = await params;

    // Validate route parameters
    const { taskId } = validateParams(taskIdParamSchema, rawParams);

    const task = await TaskService.deleteTask(userId, taskId);

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error deleting task:", error);

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
      { error: "Something went wrong while deleting task." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const userId = await getUserId();
    const rawParams = await params;

    // Validate route parameters
    const { taskId } = validateParams(taskIdParamSchema, rawParams);

    const body = await req.json();

    // Validate request body
    const validatedData = validateRequestBody(toggleCompleteSchema, body);

    await TaskService.toggleComplete(userId, taskId, validatedData.previousStatus);

    return NextResponse.json(
      { message: "Task status updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task status:", error);

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
      { error: "Something went wrong while updating task status." },
      { status: 500 }
    );
  }
}
