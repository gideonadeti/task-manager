import { NextRequest, NextResponse } from "next/server";
import { updateGroup, readGroup, deleteGroup } from "../../../../../prisma/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  const { userId, name  } = await req.json();

  try {
    const group = await readGroup(userId, name.trim());

    if (group) {
      return NextResponse.json(
        { error: "Group name already exists." },
        { status: 400 }
      );
    }

    await updateGroup(groupId, name);

    return NextResponse.json(
      { message: "Group name updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating group name:", error);

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
  const { groupId } = await params;

  if (!groupId) {
    return NextResponse.json({ error: "Invalid group ID." }, { status: 400 });
  }

  try {
    await deleteGroup(groupId);
    return NextResponse.json(
      { message: "Group deleted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting group." },
      { status: 500 }
    );
  }
}
