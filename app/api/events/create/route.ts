import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary at the top level (once)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per image
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB total
const MAX_IMAGE_COUNT = 15; // Maximum 15 images
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

// Helper function to upload to Cloudinary
async function uploadToCloudinary(
  base64String: string
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(base64String, {
    folder: "acda/events",
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Parse FormData
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const imageFiles = formData.getAll("images") as File[];

    // Validate required fields
    if (!title || !description || !date) {
      return NextResponse.json(
        { error: "Title, description, and date are required" },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];
    const publicIds: string[] = [];

    // Validate and upload images
    if (imageFiles && imageFiles.length > 0) {
      // Validate image count
      if (imageFiles.length > MAX_IMAGE_COUNT) {
        return NextResponse.json(
          { error: `Maximum ${MAX_IMAGE_COUNT} images allowed` },
          { status: 400 }
        );
      }

      // Validate each image
      let totalSize = 0;
      for (const file of imageFiles) {
        // Check if it's actually a File object
        if (!(file instanceof File)) {
          return NextResponse.json({ error: "Invalid file format" }, { status: 400 });
        }

        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          return NextResponse.json(
            { error: `Invalid file type: ${file.type}. Only JPG, PNG, and WEBP are allowed` },
            { status: 400 }
          );
        }

        // Validate individual file size
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File ${file.name} exceeds 10MB limit` },
            { status: 400 }
          );
        }

        totalSize += file.size;
      }

      // Validate total size
      if (totalSize > MAX_TOTAL_SIZE) {
        return NextResponse.json({ error: `Total file size exceeds 100MB limit` }, { status: 400 });
      }

      // Upload all images to Cloudinary in parallel
      try {
        const base64Promises = imageFiles.map((file) => fileToBase64(file));
        const base64Strings = await Promise.all(base64Promises);

        const uploadPromises = base64Strings.map((base64) => uploadToCloudinary(base64));
        const results = await Promise.all(uploadPromises);

        results.forEach((result) => {
          imageUrls.push(result.url);
          publicIds.push(result.publicId);
        });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload images to cloud storage" },
          { status: 500 }
        );
      }
    }

    // Create new event
    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      imageUrls,
      publicIds,
      isUpcoming: new Date(date) >= new Date(),
    });

    return NextResponse.json({
      success: true,
      message: `Event created successfully${imageUrls.length > 0 ? ` with ${imageUrls.length} image${imageUrls.length > 1 ? "s" : ""}` : ""}`,
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create event",
      },
      { status: 500 }
    );
  }
}
