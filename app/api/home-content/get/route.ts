import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HomeContent from "@/models/HomeContent";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/home-content/get
 * Fetch home page content (announcement and images)
 * Public endpoint - no authentication required
 */
export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Find or create home content
    let homeContent = await HomeContent.findOne();

    // If no content exists, create default
    if (!homeContent) {
      homeContent = await HomeContent.create({
        announcementMessage: "Welcome to ACDA - Asansol Coalfield Diabetes Association",
        announcementEnabled: true,
        welcomeImageUrl: "/images/welcome.jpeg",
        welcomeImagePublicId: "",
        acdaconImageUrl: "/images/acdacon.jpeg",
        acdaconImagePublicId: "",
        membershipImageUrl: "/images/membership.JPG",
        membershipImagePublicId: "",
      });
    }

    return NextResponse.json(
      {
        content: {
          announcementMessage: homeContent.announcementMessage,
          announcementEnabled: homeContent.announcementEnabled,
          welcomeImageUrl: homeContent.welcomeImageUrl,
          acdaconImageUrl: homeContent.acdaconImageUrl,
          membershipImageUrl: homeContent.membershipImageUrl,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching home content:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch home content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
