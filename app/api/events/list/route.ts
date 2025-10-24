import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

// Allow edge caching
export const revalidate = 60; // revalidate every 60s
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // 'upcoming' or 'past' or 'all'
    const now = new Date();

    let query = {};
    if (type === "upcoming") query = { date: { $gte: now } };
    else if (type === "past") query = { date: { $lt: now } };

    const events = await Event.find(query).sort({ date: -1 }).lean();

    const res = NextResponse.json({ success: true, count: events.length, events });
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
    return res;
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}
