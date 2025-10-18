import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

/**
 * Create Admin User API
 * POST /api/admin/create
 *
 * IMPORTANT: This endpoint should be disabled in production or protected
 * Only use this for initial setup
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Validate username length
    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      username: username.toLowerCase().trim(),
    });

    if (existingAdmin) {
      return NextResponse.json({ error: "Admin user already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
    });

    console.log("✅ Admin user created:", admin.username);

    return NextResponse.json(
      {
        success: true,
        message: "Admin user created successfully",
        admin: {
          id: admin._id,
          username: admin.username,
          createdAt: admin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create admin user",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Get Admin Count API
 * GET /api/admin/create
 *
 * Returns the count of admin users (useful for checking if setup is needed)
 */
export async function GET() {
  try {
    await connectDB();
    const count = await Admin.countDocuments();

    return NextResponse.json({
      success: true,
      count,
      setupNeeded: count === 0,
    });
  } catch (error) {
    console.error("Error checking admin count:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to check admin count",
      },
      { status: 500 }
    );
  }
}
