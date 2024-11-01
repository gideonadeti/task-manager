import { NextRequest, NextResponse } from "next/server";

import { updateTask, deleteTask } from "../../../../../prisma/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params;
  const { title, description, dueDate, priority, groupId } = await req.json();

  try {
    await updateTask(taskId, title, description, dueDate, priority, groupId);

    return NextResponse.json(
      { message: "Task updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while updating task." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params;

  try {
    await deleteTask(taskId);

    return NextResponse.json(
      { message: "Task deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while deleting task." },
      { status: 500 }
    );
  }
}
