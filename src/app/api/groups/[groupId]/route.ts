import { NextRequest, NextResponse } from "next/server";
import { updateGroup, readGroup } from "../../../../../prisma/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  const { groupId } = params;
  const { name } = await req.json();

  try {
    const group = await readGroup(name.trim());

    if (group) {
      return NextResponse.json(
        { error: "Group name already exists." },
        { status: 400 }
      );
    }

    await updateGroup(groupId, name);

    return NextResponse.json(
      { message: "Group updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while updating group." },
      { status: 500 }
    );
  }
}
