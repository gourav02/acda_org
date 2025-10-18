import mongoose, { Schema, Model } from "mongoose";

/**
 * Admin Interface
 * Defines the structure of an admin user document
 */
export interface IAdmin {
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Admin Schema
 * Schema for storing admin user credentials
 */
const AdminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [50, "Username cannot exceed 50 characters"],
      validate: {
        validator: function (v: string) {
          // Allow either username format (letters, numbers, _, -) or email format
          const usernameRegex = /^[a-zA-Z0-9_-]+$/;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return usernameRegex.test(v) || emailRegex.test(v);
        },
        message:
          "Username must be either a valid username (letters, numbers, underscores, hyphens) or a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [60, "Password hash must be at least 60 characters"], // bcrypt hash length
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster username lookups
AdminSchema.index({ username: 1 });

/**
 * Admin Model
 * Check if model exists to prevent recompilation in development
 */
const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
