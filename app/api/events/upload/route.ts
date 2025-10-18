import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import EventPhoto from "@/models/EventPhoto";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { eventName, year, imageUrl, publicId, width, height, format } = body;

    // Validation
    if (!eventName || !year || !imageUrl || !publicId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Create event photo
    const eventPhoto = await EventPhoto.create({
      eventName: eventName.trim(),
      year: parseInt(year),
      imageUrl,
      publicId,
      width: width || null,
      height: height || null,
      format: format || null,
      uploadedBy: session.user.name || "Admin",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Photo uploaded successfully",
        photo: {
          id: eventPhoto._id,
          eventName: eventPhoto.eventName,
          year: eventPhoto.year,
          imageUrl: eventPhoto.imageUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      {
        error: "Failed to save photo",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
