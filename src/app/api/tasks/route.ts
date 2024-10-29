import { NextRequest, NextResponse } from "next/server";

import { readTasks } from "../../../../prisma/db";

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
