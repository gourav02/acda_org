import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import EventPhoto from "@/models/EventPhoto";

export async function GET(request: NextRequest) {
  try {
    // Get year from query params
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year");

    // Connect to database
    await connectDB();

    // Build query
    const query = year ? { year: parseInt(year) } : {};

    // Fetch photos, sorted by newest first
    const photos = await EventPhoto.find(query)
      .sort({ createdAt: -1 })
      .select("eventName year imageUrl publicId width height format createdAt")
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: photos.length,
        photos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch photos API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch photos",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
