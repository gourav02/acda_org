"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { Upload, Loader2, CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PhotoUploadForm() {
  const [eventName, setEventName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadStatus({
          type: "error",
          message: "Please select a valid image file",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadStatus({
          type: "error",
          message: "File size must be less than 10MB",
        });
        return;
      }

      setSelectedFile(file);
      setUploadStatus({ type: null, message: "" });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!eventName.trim()) {
      setUploadStatus({ type: "error", message: "Please enter an event name" });
      return;
    }

    if (!selectedFile) {
      setUploadStatus({ type: "error", message: "Please select an image" });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      // Step 1: Upload to Cloudinary
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", `acda/events/${year}`);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const cloudinaryData = await cloudinaryResponse.json();

      // Step 2: Save to database
      const dbResponse = await fetch("/api/events/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: eventName.trim(),
          year,
          imageUrl: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          width: cloudinaryData.width,
          height: cloudinaryData.height,
          format: cloudinaryData.format,
        }),
      });

      if (!dbResponse.ok) {
        throw new Error("Failed to save photo to database");
      }

      // Success!
      setUploadStatus({
        type: "success",
        message: "Photo uploaded successfully!",
      });

      // Reset form
      setEventName("");
      setYear(new Date().getFullYear());
      setSelectedFile(null);
      setPreviewUrl(null);

      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
          <Upload className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Upload Event Photo</h2>
          <p className="text-sm text-gray-600">Add photos to your event gallery</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
        <div>
          <Label htmlFor="event-name" className="text-sm font-medium text-gray-700">
            Event Name *
          </Label>
          <Input
            id="event-name"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., Health Camp 2024"
            className="mt-1"
            disabled={isUploading}
            required
          />
        </div>

        {/* Year */}
        <div>
          <Label htmlFor="year" className="text-sm font-medium text-gray-700">
            Year *
          </Label>
          <Input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min={2000}
            max={2030}
            className="mt-1"
            disabled={isUploading}
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <Label htmlFor="file-input" className="text-sm font-medium text-gray-700">
            Image File *
          </Label>
          <div className="mt-1">
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="file-input"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-primary-400 hover:bg-primary-50 ${
                isUploading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {previewUrl ? (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Preview of selected image"
                    width={300}
                    height={200}
                    className="max-h-48 rounded-lg object-contain"
                    unoptimized
                  />
                  <div className="mt-2 text-center text-sm text-gray-600">{selectedFile?.name}</div>
                </div>
              ) : (
                <>
                  <ImageIcon className="mb-2 h-12 w-12 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Status Messages */}
        {uploadStatus.type && (
          <div
            className={`flex items-center gap-2 rounded-lg p-4 ${
              uploadStatus.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {uploadStatus.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <p className="text-sm font-medium">{uploadStatus.message}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="w-full bg-primary text-white hover:bg-primary/90"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Upload Photo
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
