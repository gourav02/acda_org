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
  X,
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadMessage("Please select only image files");
        setUploadStatus("error");
        continue;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadMessage("File size must be less than 10MB");
        setUploadStatus("error");
        continue;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewUrls.push(reader.result as string);
        if (newPreviewUrls.length === validFiles.length) {
          setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        }
      };
      reader.readAsDataURL(file);
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setUploadStatus("idle");
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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

      setUploadMessage("Creating event and uploading images...");

      // Create FormData with all event data and images
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("location", location);

      // Append all image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Single API call to create event with all images
      const response = await fetch("/api/events/create", {
        method: "POST",
        body: formData,
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
        setSelectedFiles([]);
        setPreviewUrls([]);
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
          <Label className="text-base font-semibold text-gray-700">Event Images (Optional)</Label>
          <p className="mb-3 text-sm text-gray-500">Upload multiple images to showcase the event</p>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
            multiple
          />
          
          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={150}
                    className="h-32 w-full rounded-lg object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="mt-1 truncate text-xs text-gray-600">
                    {selectedFiles[index]?.name}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <label
            htmlFor="file-input"
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-primary-400 hover:bg-primary-50 ${
              isUploading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <ImageIcon className="mb-2 h-12 w-12 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              {previewUrls.length > 0 ? "Click to add more images" : "Click to upload images"}
            </p>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 10MB each</p>
          </label>
        </div>

        {/* Status Message */}
        {uploadMessage && (
          <div
            className={`flex items-center gap-2 rounded-lg p-4 ${
              uploadStatus === "success" ? "bg-green-50 text-green-800" : uploadStatus === "error" ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800"
            }`}
          >
            {uploadStatus === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : uploadStatus === "error" ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin" />
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