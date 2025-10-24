"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Upload, Loader2, CheckCircle, XCircle, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SelectedFile {
  file: File;
  previewUrl: string;
  id: string;
}

interface UploadResult {
  fileName: string;
  status: "success" | "error";
  message: string;
}

export default function PhotoUploadForm() {
  const [eventName, setEventName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);

  // Handle file selection (multiple files)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const validFiles: SelectedFile[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: Not a valid image file`);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: File size must be less than 10MB`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      const fileId = `${Date.now()}-${Math.random()}`;

      reader.onloadend = () => {
        validFiles.push({
          file,
          previewUrl: reader.result as string,
          id: fileId,
        });

        // Update state when all files are processed
        if (validFiles.length + errors.length === files.length) {
          setSelectedFiles((prev) => [...prev, ...validFiles]);
          if (errors.length > 0) {
            setUploadStatus({
              type: "error",
              message: errors.join("; "),
            });
          } else {
            setUploadStatus({ type: null, message: "" });
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // Remove a selected file
  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!eventName.trim()) {
      setUploadStatus({ type: "error", message: "Please enter an event name" });
      return;
    }

    if (selectedFiles.length === 0) {
      setUploadStatus({ type: "error", message: "Please select at least one image" });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });
    setUploadResults([]);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setUploadStatus({
        type: "error",
        message: "Cloudinary configuration is missing",
      });
      setIsUploading(false);
      return;
    }

    const results: UploadResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Upload each file
    for (const selectedFile of selectedFiles) {
      try {
        // Step 1: Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", selectedFile.file);
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
          throw new Error("Failed to upload to Cloudinary");
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
          throw new Error("Failed to save to database");
        }

        results.push({
          fileName: selectedFile.file.name,
          status: "success",
          message: "Uploaded successfully",
        });
        successCount++;
      } catch (error) {
        results.push({
          fileName: selectedFile.file.name,
          status: "error",
          message: error instanceof Error ? error.message : "Upload failed",
        });
        errorCount++;
      }
    }

    setUploadResults(results);

    // Set overall status
    if (errorCount === 0) {
      setUploadStatus({
        type: "success",
        message: `All ${successCount} photo(s) uploaded successfully!`,
      });

      // Reset form
      setEventName("");
      setYear(new Date().getFullYear());
      setSelectedFiles([]);

      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else if (successCount === 0) {
      setUploadStatus({
        type: "error",
        message: `Failed to upload all ${errorCount} photo(s)`,
      });
    } else {
      setUploadStatus({
        type: "error",
        message: `Uploaded ${successCount} photo(s), but ${errorCount} failed`,
      });
    }

    setIsUploading(false);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
          <Upload className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Upload Event Photos</h2>
          <p className="text-sm text-gray-600">Add multiple photos to your event gallery</p>
        </div>
      </div>

      <div className="space-y-6">
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
            Image Files * ({selectedFiles.length} selected)
          </Label>
          <div className="mt-1">
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
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
              <ImageIcon className="mb-2 h-12 w-12 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">Click to upload images</p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 10MB each</p>
              <p className="mt-1 text-xs text-gray-500">Select multiple files at once</p>
            </label>
          </div>
        </div>

        {/* Preview Grid */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {selectedFiles.map((selectedFile) => (
              <div key={selectedFile.id} className="group relative">
                <Image
                  src={selectedFile.previewUrl}
                  alt={selectedFile.file.name}
                  width={200}
                  height={150}
                  className="h-32 w-full rounded-lg object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => removeFile(selectedFile.id)}
                  disabled={isUploading}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 group-hover:opacity-100"
                  aria-label={`Remove ${selectedFile.file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="mt-1 truncate text-xs text-gray-600" title={selectedFile.file.name}>
                  {selectedFile.file.name}
                </p>
              </div>
            ))}
          </div>
        )}

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

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Upload Details:</h3>
            {uploadResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 rounded p-2 text-sm ${
                  result.status === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {result.status === "success" ? (
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{result.fileName}</p>
                  <p className="text-xs">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isUploading || selectedFiles.length === 0}
          className="w-full bg-primary text-white hover:bg-primary/90"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading {selectedFiles.length} photo(s)...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
