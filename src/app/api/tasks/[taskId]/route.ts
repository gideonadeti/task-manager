import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import {
  updateTask,
  deleteTask,
  toggleComplete,
} from "../../../../../prisma/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const userId = await getUserId();
    const { taskId } = await params;
    const { title, description, dueDate, priority, groupId } = await req.json();

    const task = await updateTask(
      taskId,
      title,
      description,
      dueDate,
      priority,
      groupId,
      userId
    );

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error updating task:", error);

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

export async function DELETE({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  try {
    const userId = await getUserId();
    const { taskId } = await params;

    const task = await deleteTask(taskId, userId);

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error deleting task:", error);

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
    const { taskId } = await params;
    const { previousStatus } = await req.json();

    await toggleComplete(taskId, previousStatus, userId);

    return NextResponse.json(
      { message: "Task status updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task status:", error);

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
