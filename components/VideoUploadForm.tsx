"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Upload, Loader2, CheckCircle, XCircle, Video, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface VideoData {
  videoUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  duration: number;
  size: number;
  uploadedAt: string;
}

export default function VideoUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Fetch current video on mount
  useEffect(() => {
    fetchCurrentVideo();
  }, []);

  const fetchCurrentVideo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/hero-video/get");

      if (response.ok) {
        const data = await response.json();
        setCurrentVideo(data.video);
      } else if (response.status === 404) {
        setCurrentVideo(null);
      }
    } catch (error) {
      console.error("Error fetching current video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setUploadStatus({
        type: "error",
        message: "Please select a valid video file",
      });
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      setUploadStatus({
        type: "error",
        message: "Video file size must be less than 100MB",
      });
      return;
    }

    setSelectedFile(file);
    setUploadStatus({ type: null, message: "" });

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle video upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ type: "error", message: "Please select a video file" });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });

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

    try {
      // Step 1: Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "acda/hero-video");
      formData.append("resource_type", "video");

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
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
      const dbResponse = await fetch("/api/hero-video/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          width: cloudinaryData.width,
          height: cloudinaryData.height,
          format: cloudinaryData.format,
          duration: cloudinaryData.duration,
          size: cloudinaryData.bytes,
        }),
      });

      if (!dbResponse.ok) {
        throw new Error("Failed to save to database");
      }

      setUploadStatus({
        type: "success",
        message: "Hero video uploaded successfully!",
      });

      // Reset form
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);

      // Reset file input
      const fileInput = document.getElementById("video-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh current video
      await fetchCurrentVideo();
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle video deletion
  const handleDelete = async () => {
    if (!currentVideo) return;

    if (!confirm("Are you sure you want to delete the current hero video?")) {
      return;
    }

    setIsDeleting(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/hero-video/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId: currentVideo.publicId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete video");
      }

      setUploadStatus({
        type: "success",
        message: "Hero video deleted successfully!",
      });

      setCurrentVideo(null);
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Delete failed",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
          <Video className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Manage Hero Video</h2>
          <p className="text-sm text-gray-600">Upload or replace the hero section video</p>
        </div>
      </div>

      {/* Current Video Section */}
      {isLoading ? (
        <div className="mb-6 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        currentVideo && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Current Hero Video</h3>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>

            <div className="mb-3">
              <video
                src={currentVideo.videoUrl}
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: "300px" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 md:grid-cols-4">
              <div>
                <span className="font-medium">Format:</span> {currentVideo.format.toUpperCase()}
              </div>
              <div>
                <span className="font-medium">Size:</span> {formatFileSize(currentVideo.size)}
              </div>
              <div>
                <span className="font-medium">Duration:</span>{" "}
                {formatDuration(currentVideo.duration)}
              </div>
              <div>
                <span className="font-medium">Resolution:</span> {currentVideo.width}x
                {currentVideo.height}
              </div>
            </div>
          </div>
        )
      )}
      {/* Upload Section */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="video-input" className="text-sm font-medium text-gray-700">
            {currentVideo ? "Upload New Video (Replace Current)" : "Upload Video"}
          </Label>
          <div className="mt-1">
            <input
              id="video-input"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="video-input"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-primary-400 hover:bg-primary-50 ${
                isUploading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <Video className="mb-2 h-12 w-12 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">Click to upload video</p>
              <p className="mt-1 text-xs text-gray-500">MP4, WebM, MOV up to 100MB</p>
              <p className="mt-1 text-xs text-gray-500">Maximum duration: 10 minutes</p>
            </label>
          </div>
        </div>

        {/* Preview */}
        {previewUrl && selectedFile && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Preview</h3>
            <video
              src={previewUrl}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: "300px" }}
            />
            <div className="mt-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">File:</span> {selectedFile.name}
              </p>
              <p>
                <span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}
              </p>
            </div>
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

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className="w-full bg-primary text-white hover:bg-primary/90"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading Video...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              {currentVideo ? "Replace Hero Video" : "Upload Hero Video"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
