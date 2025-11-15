import { NextRequest, NextResponse } from "next/server";

import { readTasks, createTask, readTask } from "../../../../prisma/db";
import { getUserId } from "@/lib/auth/get-user-id";

export async function GET() {
  try {
    const userId = await getUserId();
    const tasks = await readTasks(userId);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error(error);

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
    const { title, description, dueDate, priority, groupId } = await req.json();

    const task = await readTask(title.trim(), userId);

    if (task) {
      return NextResponse.json(
        { error: "Task already exists." },
        { status: 400 }
      );
    }

    const createdTask = await createTask(
      title.trim(),
      description.trim(),
      dueDate,
      priority.trim(),
      groupId.trim(),
      userId
    );

    return NextResponse.json({ task: createdTask }, { status: 201 });
  } catch (error) {
    console.error(error);

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
