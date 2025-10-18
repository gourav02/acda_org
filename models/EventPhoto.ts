import mongoose, { Schema, Model } from "mongoose";

/**
 * EventPhoto Interface
 * Defines the structure of an event photo document
 */
export interface IEventPhoto {
  eventName: string;
  year: number;
  imageUrl: string;
  publicId: string;
  uploadedAt: Date;
}

/**
 * EventPhoto Schema
 * Schema for storing event photos with Cloudinary integration
 */
const EventPhotoSchema = new Schema<IEventPhoto>(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      maxlength: [200, "Event name cannot exceed 200 characters"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1900, "Year must be 1900 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
      trim: true,
      unique: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Indexes for better query performance
EventPhotoSchema.index({ eventName: 1, year: -1 });
EventPhotoSchema.index({ year: -1 });
EventPhotoSchema.index({ uploadedAt: -1 });

/**
 * EventPhoto Model
 * Check if model exists to prevent recompilation in development
 */
const EventPhoto: Model<IEventPhoto> =
  mongoose.models.EventPhoto || mongoose.model<IEventPhoto>("EventPhoto", EventPhotoSchema);

export default EventPhoto;
