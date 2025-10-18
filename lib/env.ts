/**
 * Environment Variables Configuration
 * This file provides type-safe access to environment variables
 */

// Validate that required environment variables are present
function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || "";
}

// Server-side environment variables (not exposed to client)
export const env = {
  // Database
  database: {
    mongodbUri: getEnvVar("MONGODB_URI", false),
  },

  // Authentication
  auth: {
    nextAuthSecret: getEnvVar("NEXTAUTH_SECRET", false),
    nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    apiKey: getEnvVar("CLOUDINARY_API_KEY", false),
    apiSecret: getEnvVar("CLOUDINARY_API_SECRET", false),
  },

  // Email (Resend)
  email: {
    resendApiKey: getEnvVar("RESEND_API_KEY", false),
    adminEmail: getEnvVar("ADMIN_EMAIL", false),
  },

  // Site configuration
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

// Client-side environment variables (exposed via NEXT_PUBLIC_ prefix)
export const publicEnv = {
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

// Type definitions for environment variables
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      MONGODB_URI?: string;

      // Cloudinary
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
      CLOUDINARY_API_KEY?: string;
      CLOUDINARY_API_SECRET?: string;

      // Email
      RESEND_API_KEY?: string;
      ADMIN_EMAIL?: string;

      // Site
      NEXT_PUBLIC_SITE_URL?: string;
    }
  }
}

// Helper function to check if we're in production
export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";
export const isTest = process.env.NODE_ENV === "test";

// Export this to ensure the file is treated as a module
export {};
