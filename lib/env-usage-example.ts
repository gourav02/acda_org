/**
 * Example usage of environment variables
 * This file demonstrates how to use the type-safe env configuration
 */

import { env, publicEnv, isProduction, isDevelopment } from "./env";

// ============================================
// SERVER-SIDE USAGE (API routes, server components, etc.)
// ============================================

// Example: Using Cloudinary configuration
export function getCloudinaryConfig() {
  return {
    cloudName: env.cloudinary.cloudName,
    apiKey: env.cloudinary.apiKey,
    apiSecret: env.cloudinary.apiSecret,
  };
}

// Example: Using email configuration
export function getEmailConfig() {
  return {
    apiKey: env.email.resendApiKey,
    from: env.email.adminEmail,
  };
}

// Example: Conditional logic based on environment
export function getApiUrl() {
  if (isProduction) {
    return env.siteUrl;
  }

  if (isDevelopment) {
    return "http://localhost:3000";
  }

  return env.siteUrl;
}

// ============================================
// CLIENT-SIDE USAGE (Client components, browser code)
// ============================================

// Example: Using public environment variables in client components
export function getPublicCloudinaryUrl(publicId: string) {
  const cloudName = publicEnv.cloudinaryCloudName;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

// Example: Getting the site URL on the client
export function getSiteUrl() {
  return publicEnv.siteUrl;
}

// ============================================
// IMPORTANT NOTES
// ============================================

/**
 * 1. Server-side variables (from `env`) can ONLY be used in:
 *    - API routes (/app/api/*)
 *    - Server Components (default in Next.js App Router)
 *    - Server Actions
 *    - Middleware
 *
 * 2. Client-side variables (from `publicEnv`) can be used in:
 *    - Client Components (marked with "use client")
 *    - Browser-side code
 *
 * 3. NEVER expose sensitive data (API keys, secrets) to the client
 *
 * 4. All NEXT_PUBLIC_* variables are bundled into the client-side JavaScript
 *    and are visible to anyone who inspects the code
 */
