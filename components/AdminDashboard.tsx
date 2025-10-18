"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User, Image, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import PhotoUploadForm from "@/components/PhotoUploadForm";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";

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
            <div className="mb-8">
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

        {/* Quick Actions Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Upload Photos Card */}
          <div className="group cursor-pointer rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 transition-colors group-hover:bg-primary-200">
              <Image className="h-6 w-6 text-primary-600" aria-label="Upload icon" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-primary-800">Upload Photos</h3>
            <p className="text-sm text-gray-600">Add new event photos to the gallery</p>
          </div>

          {/* Manage Events Card */}
          <div className="group cursor-pointer rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 transition-colors group-hover:bg-primary-200">
              <Calendar className="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-primary-800">Manage Events</h3>
            <p className="text-sm text-gray-600">Create and edit event information</p>
          </div>

          {/* View Gallery Card */}
          <div className="group cursor-pointer rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 transition-colors group-hover:bg-primary-200">
              <Image className="h-6 w-6 text-primary-600" aria-label="Gallery icon" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-primary-800">View Gallery</h3>
            <p className="text-sm text-gray-600">Browse and manage uploaded photos</p>
          </div>
        </div>

        {/* Stats Section (Placeholder) */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-bold text-primary-800">Quick Stats</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Total Photos</p>
              <p className="text-2xl font-bold text-primary-800">0</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-primary-800">0</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Recent Uploads</p>
              <p className="text-2xl font-bold text-primary-800">0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
