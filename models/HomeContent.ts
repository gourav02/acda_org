import mongoose, { Schema, Model } from "mongoose";

/**
 * HomeContent Interface
 * Defines the structure of home page content
 */
export interface IHomeContent {
  // Announcement Bar
  announcementMessage: string;
  announcementEnabled: boolean;

  // Section Images
  welcomeImageUrl: string;
  welcomeImagePublicId: string;
  acdaconImageUrl: string;
  acdaconImagePublicId: string;
  membershipImageUrl: string;
  membershipImagePublicId: string;

  updatedAt?: Date;
}

/**
 * HomeContent Schema
 * Schema for storing home page content (announcement and images)
 */
const HomeContentSchema = new Schema<IHomeContent>(
  {
    // Announcement Bar
    announcementMessage: {
      type: String,
      required: [true, "Announcement message is required"],
      default: "Welcome to ACDA - Asansol Coalfield Diabetes Association",
    },
    announcementEnabled: {
      type: Boolean,
      default: true,
    },

    // Welcome Section Image
    welcomeImageUrl: {
      type: String,
      default: "/images/welcome.jpeg",
    },
    welcomeImagePublicId: {
      type: String,
      default: "",
    },

    // ACDACon Section Image
    acdaconImageUrl: {
      type: String,
      default: "/images/acdacon.jpeg",
    },
    acdaconImagePublicId: {
      type: String,
      default: "",
    },

    // Membership Section Image
    membershipImageUrl: {
      type: String,
      default: "/images/membership.JPG",
    },
    membershipImagePublicId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * HomeContent Model
 * Check if model exists to prevent recompilation in development
 */
const HomeContent: Model<IHomeContent> =
  mongoose.models.HomeContent || mongoose.model<IHomeContent>("HomeContent", HomeContentSchema);

export default HomeContent;
