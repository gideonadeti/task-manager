import { NextRequest, NextResponse } from "next/server";

import {
  updateTask,
  deleteTask,
  toggleComplete,
} from "../../../../../prisma/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const { title, description, dueDate, priority, groupId } = await req.json();

  try {
    await updateTask(taskId, title, description, dueDate, priority, groupId);

    return NextResponse.json(
      { message: "Task updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating task." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  try {
    await deleteTask(taskId);

    return NextResponse.json(
      { message: "Task deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);

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
  const { taskId } = await params;
  const { previousStatus } = await req.json();

  try {
    await toggleComplete(taskId, previousStatus);

    return NextResponse.json(
      { message: "Task status updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task status:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating task status." },
      { status: 500 }
    );
  }
}
