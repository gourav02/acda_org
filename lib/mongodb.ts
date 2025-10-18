import mongoose from "mongoose";

/**
 * Get MongoDB URI from environment
 * Throws error if not defined when called (not at import time)
 */
function getMongoDBUri(): string {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }
  return process.env.MONGODB_URI;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB using Mongoose
 * Uses connection caching to prevent multiple connections in development
 *
 * @returns Promise<typeof mongoose> - Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  // Return existing promise if connection is in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log("🔄 Creating new MongoDB connection...");

    // Get MongoDB URI (will throw if not defined)
    const mongoUri = getMongoDBUri();

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 * Useful for cleanup in serverless environments
 */
async function disconnectDB(): Promise<void> {
  if (!cached.conn) {
    return;
  }

  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  console.log("🔌 MongoDB disconnected");
}

/**
 * Get connection status
 * @returns boolean - true if connected, false otherwise
 */
function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Get connection state as string
 * @returns string - Connection state
 */
function getConnectionState(): string {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[mongoose.connection.readyState as keyof typeof states] || "unknown";
}

export { connectDB, disconnectDB, isConnected, getConnectionState };
export default connectDB;
