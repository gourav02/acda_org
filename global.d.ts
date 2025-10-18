import type mongoose from "mongoose";

/**
 * Global type declarations for the application
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Mongoose global caching for Next.js
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

export {};
