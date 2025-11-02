import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HeroVideo from "@/models/HeroVideo";

/**
 * GET /api/hero-video/get
 * Fetch the active hero video
 * Public endpoint - no authentication required
 */
export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Find the active hero video
    const heroVideo = await HeroVideo.findOne({ isActive: true }).sort({ uploadedAt: -1 });

    if (!heroVideo) {
      return NextResponse.json({ error: "No active hero video found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        video: {
          videoUrl: heroVideo.videoUrl,
          publicId: heroVideo.publicId,
          width: heroVideo.width,
          height: heroVideo.height,
          format: heroVideo.format,
          duration: heroVideo.duration,
          size: heroVideo.size,
          uploadedAt: heroVideo.uploadedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching hero video:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch hero video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
