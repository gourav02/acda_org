/**
 * Application-wide constants
 */

export const YEARS = [2021, 2022, 2023, 2024, 2025] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const IMAGE_UPLOAD_CONFIG = {
  maxSize: MAX_FILE_SIZE,
  acceptedTypes: ACCEPTED_IMAGE_TYPES,
  maxFiles: 10, // Maximum number of files that can be uploaded at once
} as const;
