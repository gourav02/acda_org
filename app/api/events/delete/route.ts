import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("id");

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete all images from Cloudinary if they exist
    if (event.publicIds && event.publicIds.length > 0) {
      try {
        // Delete multiple images
        await Promise.all(
          event.publicIds.map((publicId: string) =>
            cloudinary.uploader.destroy(publicId)
          )
        );
      } catch (cloudinaryError) {
        console.error("Error deleting images from Cloudinary:", cloudinaryError);
        // Continue with event deletion even if image deletion fails
      }
    }

    // Delete event
    await Event.findByIdAndDelete(eventId);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
  }
}