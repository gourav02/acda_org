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
 * POST /api/hero-video/upload
 * Upload hero video metadata to database after Cloudinary upload
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
    const { videoUrl, publicId, width, height, format, duration, size } = body;

    // Validate required fields
    if (!videoUrl || !publicId || !width || !height || !format || !duration || !size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Deactivate all existing hero videos
    await HeroVideo.updateMany({}, { isActive: false });

    // Create new hero video entry
    const heroVideo = await HeroVideo.create({
      videoUrl,
      publicId,
      width,
      height,
      format,
      duration,
      size,
      isActive: true,
      uploadedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Hero video uploaded successfully",
        video: heroVideo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading hero video:", error);
    return NextResponse.json(
      {
        error: "Failed to upload hero video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
