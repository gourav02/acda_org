"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import {
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Image as ImageIcon,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HomeContentData {
  announcementMessage: string;
  announcementEnabled: boolean;
  welcomeImageUrl: string;
  acdaconImageUrl: string;
  membershipImageUrl: string;
}

interface ImageSection {
  id: "welcome" | "acdacon" | "membership";
  label: string;
  description: string;
  currentUrl: string;
}

export default function HomeContentManager() {
  const [content, setContent] = useState<HomeContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  // Form states
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  // Image upload states
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({
    welcome: null,
    acdacon: null,
    membership: null,
  });

  const [previewUrls, setPreviewUrls] = useState<{
    [key: string]: string | null;
  }>({
    welcome: null,
    acdacon: null,
    membership: null,
  });

  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Fetch current content
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/home-content/get");

      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
        setAnnouncementMessage(data.content.announcementMessage);
        setAnnouncementEnabled(data.content.announcementEnabled);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setUploadStatus({
        type: "error",
        message: "Failed to load content",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle announcement update
  const handleAnnouncementUpdate = async () => {
    if (!announcementMessage.trim()) {
      setUploadStatus({
        type: "error",
        message: "Announcement message cannot be empty",
      });
      return;
    }

    setIsSaving(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/home-content/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          announcementMessage,
          announcementEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update announcement");
      }

      setUploadStatus({
        type: "success",
        message: "Announcement updated successfully!",
      });

      await fetchContent();
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Update failed",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle file selection
  const handleFileChange = (section: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

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
        message: "Image file size must be less than 10MB",
      });
      return;
    }

    setSelectedFiles((prev) => ({ ...prev, [section]: file }));
    setUploadStatus({ type: null, message: "" });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrls((prev) => ({ ...prev, [section]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Handle image upload
  const handleImageUpload = async (section: "welcome" | "acdacon" | "membership") => {
    const file = selectedFiles[section];

    if (!file) {
      setUploadStatus({
        type: "error",
        message: "Please select an image first",
      });
      return;
    }

    setUploadingSection(section);
    setUploadStatus({ type: null, message: "" });

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setUploadStatus({
        type: "error",
        message: "Cloudinary configuration is missing",
      });
      setUploadingSection(null);
      return;
    }

    try {
      // Step 1: Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", `acda/home-content/${section}`);

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
      const dbResponse = await fetch("/api/home-content/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section,
          imageUrl: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
        }),
      });

      if (!dbResponse.ok) {
        throw new Error("Failed to save to database");
      }

      setUploadStatus({
        type: "success",
        message: `${section.charAt(0).toUpperCase() + section.slice(1)} image updated successfully!`,
      });

      // Reset
      setSelectedFiles((prev) => ({ ...prev, [section]: null }));
      setPreviewUrls((prev) => ({ ...prev, [section]: null }));

      // Reset file input
      const fileInput = document.getElementById(`${section}-input`) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh content
      await fetchContent();
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setUploadingSection(null);
    }
  };

  const imageSections: ImageSection[] = [
    {
      id: "welcome",
      label: "Welcome Section Image",
      description: "Image displayed in the Welcome section on the homepage",
      currentUrl: content?.welcomeImageUrl || "",
    },
    {
      id: "acdacon",
      label: "ACDACon Section Image",
      description: "Image displayed in the ACDACon section on the homepage",
      currentUrl: content?.acdaconImageUrl || "",
    },
    {
      id: "membership",
      label: "Membership Section Image",
      description: "Image displayed in the Membership section on the homepage",
      currentUrl: content?.membershipImageUrl || "",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white p-12 shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Announcement Bar Section */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <MessageSquare className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-800">Announcement Bar</h2>
            <p className="text-sm text-gray-600">Manage the announcement message on homepage</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="announcement-message" className="text-sm font-medium text-gray-700">
              Announcement Message
            </Label>
            <Textarea
              id="announcement-message"
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              placeholder="Enter announcement message..."
              className="mt-1"
              rows={3}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="announcement-enabled"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              disabled={isSaving}
            />
            <Label htmlFor="announcement-enabled" className="text-sm font-medium text-gray-700">
              Show announcement bar on homepage
            </Label>
          </div>

          <Button
            onClick={handleAnnouncementUpdate}
            disabled={isSaving}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Announcement
              </>
            )}
          </Button>
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

      {/* Image Sections */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <ImageIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-800">Section Images</h2>
            <p className="text-sm text-gray-600">Update images for different homepage sections</p>
          </div>
        </div>

        <div className="space-y-8">
          {imageSections.map((section) => (
            <div key={section.id} className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">{section.label}</h3>
              <p className="mb-4 text-sm text-gray-600">{section.description}</p>

              {/* Current Image */}
              {section.currentUrl && (
                <div className="mb-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">Current Image:</p>
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={section.currentUrl}
                      alt={section.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="mb-4">
                <Label
                  htmlFor={`${section.id}-input`}
                  className="text-sm font-medium text-gray-700"
                >
                  Upload New Image
                </Label>
                <input
                  id={`${section.id}-input`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(section.id, e)}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                  disabled={uploadingSection === section.id}
                />
              </div>

              {/* Preview */}
              {previewUrls[section.id] && (
                <div className="mb-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">Preview:</p>
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={previewUrls[section.id]!}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={() => handleImageUpload(section.id)}
                disabled={!selectedFiles[section.id] || uploadingSection === section.id}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {uploadingSection === section.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
