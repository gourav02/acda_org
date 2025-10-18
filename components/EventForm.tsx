"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import {
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadMessage("Please select an image file");
        setUploadStatus("error");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadMessage("File size must be less than 10MB");
        setUploadStatus("error");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "acda/events");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary upload error:", errorData);
      throw new Error(errorData.error?.message || "Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadStatus("idle");
    setUploadMessage("");

    try {
      // Validate required fields
      if (!title || !description || !date) {
        setUploadMessage("Please fill in all required fields");
        setUploadStatus("error");
        setIsUploading(false);
        return;
      }

      let imageUrl = "";
      let publicId = "";

      // Upload image if selected
      if (selectedFile) {
        const cloudinaryData = await uploadToCloudinary(selectedFile);
        imageUrl = cloudinaryData.url;
        publicId = cloudinaryData.publicId;
      }

      // Create event
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          date,
          location,
          imageUrl,
          publicId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      setUploadStatus("success");
      setUploadMessage("Event created successfully!");

      // Reset form
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("");
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadStatus("idle");
        setUploadMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error creating event:", error);
      setUploadStatus("error");
      setUploadMessage(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-primary-100 p-3">
          <CalendarIcon className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Add New Event</h2>
          <p className="text-sm text-gray-600">Create upcoming or past events</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div>
          <Label htmlFor="title" className="text-base font-semibold text-gray-700">
            Event Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., World Diabetes Day Walkathon 2025"
            className="mt-2"
            disabled={isUploading}
            required
          />
        </div>

        {/* Event Description */}
        <div>
          <Label htmlFor="description" className="text-base font-semibold text-gray-700">
            Event Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the event, its purpose, and key highlights..."
            className="mt-2 min-h-[120px]"
            disabled={isUploading}
            required
          />
        </div>

        {/* Date and Location Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Event Date */}
          <div>
            <Label htmlFor="date" className="text-base font-semibold text-gray-700">
              Event Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2"
              disabled={isUploading}
              required
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-base font-semibold text-gray-700">
              Location
            </Label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Asansol City Center"
                className="pl-10"
                disabled={isUploading}
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <Label className="text-base font-semibold text-gray-700">Event Image (Optional)</Label>
          <p className="mb-3 text-sm text-gray-500">Upload an image to showcase the event</p>
          <input
            type="file"
            id="file-input"
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

        {/* Status Message */}
        {uploadMessage && (
          <div
            className={`flex items-center gap-2 rounded-lg p-4 ${
              uploadStatus === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {uploadStatus === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{uploadMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isUploading}
          className="w-full bg-primary text-white hover:bg-primary/90"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Event...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Create Event
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
