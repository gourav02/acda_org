"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import PhotoUploadForm from "@/components/PhotoUploadForm";
import EventForm from "@/components/EventForm";
import EventList from "./EventList";

interface AdminDashboardProps {
  session: Session;
}

export default function AdminDashboard({ session }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "events">("photos");

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {session.user.name}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("photos")}
            className={`pb-4 text-lg font-semibold transition-colors ${
              activeTab === "photos"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ACDACON Photos
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`pb-4 text-lg font-semibold transition-colors ${
              activeTab === "events"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Events Management
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "photos" ? (
          <>
            {/* Upload Form */}
            <div className="my-24">
              <PhotoUploadForm />
            </div>
          </>
        ) : (
          <>
            {/* Event Form */}
            <div className="mb-8">
              <EventForm />
            </div>

            {/* Event List */}
            <div className="mb-8">
              <EventList />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
