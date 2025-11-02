import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get pagination params from query
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Connect to database
    await connectDB();

    // Get total count for pagination
    const totalCount = await GalleryImage.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch images with pagination, sorted by newest first
    const images = await GalleryImage.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("imageUrl publicId width height format createdAt")
      .lean();

    return NextResponse.json(
      {
        success: true,
        images,
        total: totalCount,
        totalPages,
        currentPage: page,
        imagesPerPage: limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch gallery images API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
