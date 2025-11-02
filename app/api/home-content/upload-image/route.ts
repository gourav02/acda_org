import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import HomeContent from "@/models/HomeContent";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/home-content/upload-image
 * Upload/update section image (welcome, acdacon, or membership)
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
    const { section, imageUrl, publicId } = body;

    // Validate required fields
    if (!section || !imageUrl || !publicId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate section type
    if (!["welcome", "acdacon", "membership"].includes(section)) {
      return NextResponse.json({ error: "Invalid section type" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Find or create home content
    let homeContent = await HomeContent.findOne();

    if (!homeContent) {
      homeContent = await HomeContent.create({
        announcementMessage: "Welcome to ACDA - Asansol Coalfield Diabetes Association",
        announcementEnabled: true,
      });
    }

    // Delete old image from Cloudinary if exists
    let oldPublicId = "";
    if (section === "welcome" && homeContent.welcomeImagePublicId) {
      oldPublicId = homeContent.welcomeImagePublicId;
    } else if (section === "acdacon" && homeContent.acdaconImagePublicId) {
      oldPublicId = homeContent.acdaconImagePublicId;
    } else if (section === "membership" && homeContent.membershipImagePublicId) {
      oldPublicId = homeContent.membershipImagePublicId;
    }

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log(`✅ Deleted old image from Cloudinary: ${oldPublicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting old image from Cloudinary:", cloudinaryError);
        // Continue with update even if deletion fails
      }
    }

    // Update the appropriate section
    if (section === "welcome") {
      homeContent.welcomeImageUrl = imageUrl;
      homeContent.welcomeImagePublicId = publicId;
    } else if (section === "acdacon") {
      homeContent.acdaconImageUrl = imageUrl;
      homeContent.acdaconImagePublicId = publicId;
    } else if (section === "membership") {
      homeContent.membershipImageUrl = imageUrl;
      homeContent.membershipImagePublicId = publicId;
    }

    await homeContent.save();

    return NextResponse.json(
      {
        message: `${section} image updated successfully`,
        content: {
          welcomeImageUrl: homeContent.welcomeImageUrl,
          acdaconImageUrl: homeContent.acdaconImageUrl,
          membershipImageUrl: homeContent.membershipImageUrl,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
