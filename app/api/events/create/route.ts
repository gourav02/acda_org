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

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

// Helper function to upload to Cloudinary
async function uploadToCloudinary(base64String: string): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(base64String, {
    folder: "acda/events",
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

    // Upload all images to Cloudinary in parallel (on server side)
    if (imageFiles && imageFiles.length > 0) {
      const base64Promises = imageFiles.map((file) => fileToBase64(file));
      const base64Strings = await Promise.all(base64Promises);

      const uploadPromises = base64Strings.map((base64) => uploadToCloudinary(base64));
      const results = await Promise.all(uploadPromises);

      results.forEach((result) => {
        imageUrls.push(result.url);
        publicIds.push(result.publicId);
      });
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
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create event" 
      }, 
      { status: 500 }
    );
  }
}