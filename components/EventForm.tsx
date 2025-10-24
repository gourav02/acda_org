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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per image
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB total
const MAX_IMAGE_COUNT = 15; // Maximum 15 images

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

  const getTotalSize = (files: File[]) => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Clear previous errors when new files are selected
    setUploadStatus("idle");
    setUploadMessage("");

    // Check if adding these files would exceed the maximum count
    if (selectedFiles.length + files.length > MAX_IMAGE_COUNT) {
      setUploadMessage(
        `Maximum ${MAX_IMAGE_COUNT} images allowed. You can add ${MAX_IMAGE_COUNT - selectedFiles.length} more.`
      );
      setUploadStatus("error");
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: Not an image file`);
        continue;
      }

      // Validate individual file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: Exceeds 10MB limit (${formatFileSize(file.size)})`);
        continue;
      }

      validFiles.push(file);
    }

    // Check total size with existing files
    const potentialTotalSize = getTotalSize([...selectedFiles, ...validFiles]);
    if (potentialTotalSize > MAX_TOTAL_SIZE) {
      const currentSize = getTotalSize(selectedFiles);
      const remaining = MAX_TOTAL_SIZE - currentSize;
      setUploadMessage(
        `Total size would exceed 100MB limit. Current: ${formatFileSize(currentSize)}, Remaining: ${formatFileSize(remaining)}`
      );
      setUploadStatus("error");
      return;
    }

    // Show errors if any
    if (errors.length > 0) {
      setUploadMessage(errors.join("; "));
      setUploadStatus("error");

      // If no valid files, return early
      if (validFiles.length === 0) {
        return;
      }

      // Auto-clear error after 4 seconds if there were some valid files
      setTimeout(() => {
        setUploadStatus("idle");
        setUploadMessage("");
      }, 4000);
    }

    // Create previews for valid files
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewUrls.push(reader.result as string);
        if (newPreviewUrls.length === validFiles.length) {
          setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // Reset file input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    // Clear any errors when removing images
    if (uploadStatus === "error") {
      setUploadStatus("idle");
      setUploadMessage("");
    }
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

      // Final size check before submission
      const totalSize = getTotalSize(selectedFiles);
      if (totalSize > MAX_TOTAL_SIZE) {
        setUploadMessage(`Total size (${formatFileSize(totalSize)}) exceeds 100MB limit`);
        setUploadStatus("error");
        setIsUploading(false);
        return;
      }

      setUploadMessage(
        selectedFiles.length > 0
          ? `Creating event and uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? "s" : ""}...`
          : "Creating event..."
      );

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
      setUploadMessage(
        selectedFiles.length > 0
          ? `Event created successfully with ${selectedFiles.length} image${selectedFiles.length > 1 ? "s" : ""}!`
          : "Event created successfully!"
      );

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

  const currentTotalSize = getTotalSize(selectedFiles);
  const remainingCount = MAX_IMAGE_COUNT - selectedFiles.length;

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
          <p className="mb-2 text-sm text-gray-500">Upload multiple images to showcase the event</p>

          {/* Upload Stats */}
          {selectedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
                {selectedFiles.length} / {MAX_IMAGE_COUNT} images
              </span>
              <span className="rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700">
                {formatFileSize(currentTotalSize)} / 100MB used
              </span>
              {remainingCount > 0 && (
                <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                  {remainingCount} more allowed
                </span>
              )}
            </div>
          )}

          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading || selectedFiles.length >= MAX_IMAGE_COUNT}
            multiple
          />

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="group relative">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={150}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <div className="truncate text-xs text-gray-600">
                      {selectedFiles[index]?.name}
                    </div>
                    <div className="whitespace-nowrap text-xs text-gray-500">
                      {formatFileSize(selectedFiles[index]?.size || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          {selectedFiles.length < MAX_IMAGE_COUNT && (
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
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, WEBP • Max 10MB per image • Up to {MAX_IMAGE_COUNT} images • 100MB total
              </p>
            </label>
          )}

          {/* Max Images Reached */}
          {selectedFiles.length >= MAX_IMAGE_COUNT && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Maximum of {MAX_IMAGE_COUNT} images reached
              </span>
            </div>
          )}
        </div>

        {/* Status Message */}
        {uploadMessage && (
          <div
            className={`flex items-center gap-2 rounded-lg p-4 ${
              uploadStatus === "success"
                ? "bg-green-50 text-green-800"
                : uploadStatus === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-blue-50 text-blue-800"
            }`}
          >
            {uploadStatus === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : uploadStatus === "error" ? (
              <XCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin" />
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
