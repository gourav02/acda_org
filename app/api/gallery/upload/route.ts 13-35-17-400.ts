import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { images } = body;

    // Validate request
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Images array is required" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Prepare image documents
    const imageDocuments = images.map((img) => ({
      imageUrl: img.imageUrl,
      publicId: img.publicId,
      width: img.width,
      height: img.height,
      format: img.format,
      uploadedBy: session.user.name || session.user.email,
    }));

    // Insert all images
    const savedImages = await GalleryImage.insertMany(imageDocuments);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully uploaded ${savedImages.length} image${
          savedImages.length > 1 ? "s" : ""
        }`,
        count: savedImages.length,
        images: savedImages,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gallery upload API error:", error);
    return NextResponse.json(
      {
        error: "Failed to save images to database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
