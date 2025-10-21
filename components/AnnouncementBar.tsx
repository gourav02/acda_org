"use client";

import { useState, useEffect } from "react";
import { Info, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AnnouncementPriority = "info" | "warning" | "urgent";

interface AnnouncementBarProps {
  message: string;
  priority?: AnnouncementPriority;
  storageKey?: string;
  dismissDuration?: number; // in hours
}

const priorityConfig = {
  info: {
    bgColor: "bg-white",
    textColor: "text-primary-800",
    borderColor: "border-primary-100",
    icon: Info,
    iconColor: "text-primary-600",
    hoverColor: "hover:bg-gray-50",
  },
  warning: {
    bgColor: "bg-amber-50",
    textColor: "text-amber-800",
    borderColor: "border-amber-200",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    hoverColor: "hover:bg-amber-100",
  },
  urgent: {
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    borderColor: "border-red-200",
    icon: AlertCircle,
    iconColor: "text-red-600",
    hoverColor: "hover:bg-red-100",
  },
};

export default function AnnouncementBar({
  message,
  priority = "info",
  storageKey = "announcement-dismissed",
  // dismissDuration = 24,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if announcement was dismissed
    const dismissedUntil = localStorage.getItem(storageKey);

    if (dismissedUntil) {
      const dismissedTime = new Date(dismissedUntil).getTime();
      const currentTime = new Date().getTime();

      if (currentTime < dismissedTime) {
        // Still within dismissal period
        return;
      } else {
        // Dismissal period expired, remove from storage
        localStorage.removeItem(storageKey);
      }
    }

    // Show announcement with animation
    setIsVisible(true);
    setTimeout(() => setIsAnimating(true), 10);
  }, [storageKey]);

  // const handleDismiss = () => {
  //   // Animate out
  //   setIsAnimating(false);

  //   // Set dismissal time in localStorage
  //   const dismissUntil = new Date();
  //   dismissUntil.setHours(dismissUntil.getHours() + dismissDuration);
  //   localStorage.setItem(storageKey, dismissUntil.toISOString());

  //   // Remove from DOM after animation
  //   setTimeout(() => setIsVisible(false), 300);
  // };

  if (!isVisible) return null;

  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out",
        config.bgColor,
        config.textColor,
        config.borderColor,
        isAnimating ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Icon and Message */}
        <div className="flex flex-1 items-center gap-2 sm:gap-3">
          <Icon className={cn("h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6", config.iconColor)} />
          <p className="text-sm font-medium sm:text-base">{message}</p>
        </div>

        {/* Close Button */}
        {/* <button
          onClick={handleDismiss}
          className={cn(
            "flex-shrink-0 rounded-md p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            config.hoverColor
          )}
          aria-label="Dismiss announcement"
        >
          <X className="h-5 w-5" />
        </button> */}
      </div>
    </div>
  );
}
