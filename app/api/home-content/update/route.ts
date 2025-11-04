import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import HomeContent from "@/models/HomeContent";
import { revalidatePath } from "next/cache";

/**
 * POST /api/home-content/update
 * Update home page content (announcement message and enabled status)
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { announcementMessage, announcementEnabled } = body;

    // Validate required fields
    if (announcementMessage === undefined) {
      return NextResponse.json({ error: "Announcement message is required" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Find or create home content
    let homeContent = await HomeContent.findOne();

    if (!homeContent) {
      // Create new if doesn't exist
      homeContent = await HomeContent.create({
        announcementMessage,
        announcementEnabled: announcementEnabled ?? true,
      });
    } else {
      // Update existing
      homeContent.announcementMessage = announcementMessage;
      if (announcementEnabled !== undefined) {
        homeContent.announcementEnabled = announcementEnabled;
      }
      await homeContent.save();
    }

    // Revalidate the homepage and API route to clear cache
    revalidatePath("/");
    revalidatePath("/api/home-content/get");

    return NextResponse.json(
      {
        message: "Home content updated successfully",
        content: {
          announcementMessage: homeContent.announcementMessage,
          announcementEnabled: homeContent.announcementEnabled,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating home content:", error);
    return NextResponse.json(
      {
        error: "Failed to update home content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
