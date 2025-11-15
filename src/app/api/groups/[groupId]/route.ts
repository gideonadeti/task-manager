import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/lib/auth/get-user-id";
import { updateGroup, readGroup, deleteGroup } from "../../../../../prisma/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const userId = await getUserId();
    const { groupId } = await params;
    const { name } = await req.json();

    const group = await readGroup(userId, name.trim());

    if (group) {
      return NextResponse.json(
        { error: "Group name already exists." },
        { status: 400 }
      );
    }

    const updatedGroup = await updateGroup(groupId, name, userId);

    return NextResponse.json({ group: updatedGroup });
  } catch (error) {
    console.error("Error updating group name:", error);

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
      { error: "Something went wrong while updating group name." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const userId = await getUserId();
    const { groupId } = await params;

    if (!groupId) {
      return NextResponse.json({ error: "Invalid group ID." }, { status: 400 });
    }

    const group = await deleteGroup(groupId, userId);

    return NextResponse.json({ group });
  } catch (error: unknown) {
    console.error("Error deleting group:", error);

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
      { error: "Something went wrong while deleting group." },
      { status: 500 }
    );
  }
}
