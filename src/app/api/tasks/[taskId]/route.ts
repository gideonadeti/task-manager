import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import {
  updateTask,
  deleteTask,
  toggleComplete,
  readTaskById,
} from "../../../../../prisma/db";
import {
  updateTaskSchema,
  taskIdParamSchema,
  toggleCompleteSchema,
  validateRequestBody,
  validateParams,
} from "@/lib/validations";

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

    // Ensure at least one field is provided for update
    if (
      !validatedData.title &&
      !validatedData.description &&
      !validatedData.priority &&
      !validatedData.groupId &&
      !validatedData.dueDate
    ) {
      return NextResponse.json(
        { error: "At least one field must be provided for update." },
        { status: 400 }
      );
    }

    // Fetch existing task to fill in missing fields
    const existingTask = await readTaskById(taskId, userId);

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found or you don't have access to this resource." },
        { status: 404 }
      );
    }

    const task = await updateTask(
      taskId,
      validatedData.title ?? existingTask.title,
      validatedData.description ?? existingTask.description ?? "",
      validatedData.dueDate ?? existingTask.dueDate ?? new Date(),
      validatedData.priority ?? existingTask.priority,
      validatedData.groupId ?? existingTask.groupId,
      userId
    );

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

    const task = await deleteTask(taskId, userId);

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

    await toggleComplete(taskId, validatedData.previousStatus, userId);

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
