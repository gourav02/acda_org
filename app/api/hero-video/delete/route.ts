import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import HeroVideo from "@/models/HeroVideo";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * DELETE /api/hero-video/delete
 * Delete hero video from both Cloudinary and database
 * Requires authentication
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Find the video in database
    const heroVideo = await HeroVideo.findOne({ publicId });

    if (!heroVideo) {
      return NextResponse.json({ error: "Video not found in database" }, { status: 404 });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
      console.log(`✅ Deleted video from Cloudinary: ${publicId}`);
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await HeroVideo.deleteOne({ publicId });

    return NextResponse.json(
      {
        message: "Hero video deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting hero video:", error);
    return NextResponse.json(
      {
        error: "Failed to delete hero video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
