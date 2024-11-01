import { NextRequest, NextResponse } from "next/server";

import { readTasks, createTask, readTask } from "../../../../prisma/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const tasks = await readTasks(userId);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while reading tasks." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { title, description, dueDate, priority, groupId, userId } =
    await req.json();

  try {
    const task = await readTask(title.trim());

    if (task) {
      return NextResponse.json(
        { error: "Task already exists." },
        { status: 400 }
      );
    }

    await createTask(
      title.trim(),
      description.trim(),
      dueDate,
      priority.trim(),
      groupId.trim(),
      userId.trim()
    );

    return NextResponse.json(
      { message: "Task created successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while creating task." },
      { status: 500 }
    );
  }
}
