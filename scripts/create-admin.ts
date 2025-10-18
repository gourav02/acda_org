/**
 * Script to create an admin user
 * Usage: npx tsx scripts/create-admin.ts <username> <password>
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import Admin from "../models/Admin";

async function createAdmin(username: string, password: string) {
  try {
    // Verify MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in .env.local");
      console.error("Please add MONGODB_URI to your .env.local file");
      process.exit(1);
    }

    console.log("🔄 Connecting to MongoDB...");
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });
    if (existingAdmin) {
      console.log("❌ Admin user already exists:", username);
      process.exit(1);
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    console.log("👤 Creating admin user...");
    const admin = await Admin.create({
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    console.log("✅ Admin user created successfully!");
    console.log("Username:", admin.username);
    console.log("ID:", admin._id);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: npx tsx scripts/create-admin.ts <username> <password>");
  console.log("Example: npx tsx scripts/create-admin.ts admin mySecurePassword123");
  process.exit(1);
}

const [username, password] = args;

// Validate username
if (username.length < 3) {
  console.error("❌ Username must be at least 3 characters");
  process.exit(1);
}

// Validate password
if (password.length < 8) {
  console.error("❌ Password must be at least 8 characters");
  process.exit(1);
}

// Create admin
createAdmin(username, password);
