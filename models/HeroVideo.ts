import mongoose, { Schema, Model } from "mongoose";

/**
 * HeroVideo Interface
 * Defines the structure of a hero video document
 */
export interface IHeroVideo {
  videoUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  duration: number;
  size: number;
  uploadedAt: Date;
  isActive: boolean;
}

/**
 * HeroVideo Schema
 * Schema for storing hero video metadata from Cloudinary
 */
const HeroVideoSchema = new Schema<IHeroVideo>(
  {
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
      unique: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
HeroVideoSchema.index({ isActive: 1, uploadedAt: -1 });

/**
 * HeroVideo Model
 * Check if model exists to prevent recompilation in development
 */
const HeroVideo: Model<IHeroVideo> =
  mongoose.models.HeroVideo || mongoose.model<IHeroVideo>("HeroVideo", HeroVideoSchema);

export default HeroVideo;
