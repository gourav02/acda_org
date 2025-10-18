import { NextResponse } from "next/server";
import connectDB, { getConnectionState, isConnected } from "@/lib/mongodb";

/**
 * Test MongoDB connection endpoint
 * GET /api/test-db
 */
export async function GET() {
  try {
    // Get initial state
    const initialState = getConnectionState();
    const initiallyConnected = isConnected();

    // Attempt connection
    await connectDB();

    // Get final state
    const finalState = getConnectionState();
    const finallyConnected = isConnected();

    return NextResponse.json(
      {
        success: true,
        message: "MongoDB connection test successful",
        connection: {
          initialState,
          initiallyConnected,
          finalState,
          finallyConnected,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("MongoDB connection test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "MongoDB connection failed",
        message: error instanceof Error ? error.message : "Unknown error",
        details: "Please check your MONGODB_URI in .env.local and ensure MongoDB is accessible",
      },
      { status: 500 }
    );
  }
}
