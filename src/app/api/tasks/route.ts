import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import { createTaskSchema, validateRequestBody } from "@/lib/validations";
import { TaskService } from "@/services/task-service";
import { handleApiError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    const tasks = await TaskService.getTasks(userId);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return handleApiError(error, req);
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
    return handleApiError(error, req);
  }
}
