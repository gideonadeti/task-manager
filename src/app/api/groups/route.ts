import { NextRequest, NextResponse } from "next/server";

import { readGroups, createGroup, readGroup } from "../../../../prisma/db";
import { getUserId } from "@/lib/auth/get-user-id";

export async function GET() {
  try {
    const userId = await getUserId();
    const groups = await readGroups(userId);

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while reading groups." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { name } = await req.json();

    const group = await readGroup(userId, name.trim());

    if (group) {
      return NextResponse.json(
        { error: "Group already exists." },
        { status: 400 }
      );
    }

    const createdGroup = await createGroup(name.trim(), userId);

    return NextResponse.json({ group: createdGroup }, { status: 201 });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while creating group." },
      { status: 500 }
    );
  }
}
