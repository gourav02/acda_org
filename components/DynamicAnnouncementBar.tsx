"use client";

import { useEffect, useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";

export default function DynamicAnnouncementBar() {
  const [message, setMessage] = useState("Annual ACDA conference on 25th and 26th October 2025.");
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Add cache-busting query parameter to prevent caching
        const response = await fetch(`/api/home-content/get?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMessage(data.content.announcementMessage);
          setEnabled(data.content.announcementEnabled);
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
        // Use default message on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Don't render anything while loading or if disabled
  if (isLoading || !enabled) {
    return null;
  }

  return <AnnouncementBar message={message} priority="info" />;
}
