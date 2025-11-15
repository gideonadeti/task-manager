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
import { handleApiError } from "@/lib/errors";

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
    return handleApiError(error, req);
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
    return handleApiError(error, req);
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
    return handleApiError(error, req);
  }
}
