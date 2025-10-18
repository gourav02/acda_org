import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // 'upcoming' or 'past' or 'all'

    let query = {};
    const now = new Date();

    if (type === "upcoming") {
      query = { date: { $gte: now } };
    } else if (type === "past") {
      query = { date: { $lt: now } };
    }

    const events = await Event.find(query).sort({ date: -1 }).lean();

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}
