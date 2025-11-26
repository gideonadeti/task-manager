import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { deleteAllUserData } from "@/lib/db/queries";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Get the event type
    const eventType = evt.type;

    console.log("Received verified Clerk webhook", {
      eventType,
      id: evt.data.id,
    });

    // Handle user deletion event
    if (eventType === "user.deleted") {
      const userId = evt.data.id;

      if (!userId) {
        logger.error("No user ID in webhook payload", { payload: evt.data });

        return NextResponse.json(
          { error: "No user ID provided" },
          { status: 400 }
        );
      }

      // Delete all user data from the database
      const result = await deleteAllUserData(userId);

      console.log("Successfully deleted user data via webhook", {
        userId,
        result,
      });

      return NextResponse.json(
        {
          success: true,
          message: "User data deleted successfully",
          ...result,
        },
        { status: 200 }
      );
    }

    // For other event types, just acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    logger.error("Error verifying or processing webhook", err);

    return NextResponse.json(
      { error: "Error verifying webhook" },
      { status: 400 }
    );
  }
}
