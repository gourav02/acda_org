import mongoose, { Document, Model, Schema } from "mongoose";

export interface IGalleryImage extends Document {
  imageUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
    },
    width: {
      type: Number,
      required: [true, "Width is required"],
    },
    height: {
      type: Number,
      required: [true, "Height is required"],
    },
    format: {
      type: String,
      required: [true, "Format is required"],
    },
    uploadedBy: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
GalleryImageSchema.index({ createdAt: -1 });

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage || mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);

export default GalleryImage;
