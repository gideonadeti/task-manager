import { NextRequest, NextResponse } from "next/server";

import { readGroups, createGroup } from "../../../../prisma/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const groups = await readGroups(userId);

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while reading groups." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { name, userId } = await req.json();

  try {
    await createGroup(name.trim(), userId.trim());

    return NextResponse.json(
      { message: "Group created successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while creating group." },
      { status: 500 }
    );
  }
}
