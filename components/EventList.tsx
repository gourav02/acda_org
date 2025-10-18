"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  imageUrl?: string;
  publicId?: string;
  isUpcoming: boolean;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events/list?type=all");
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setDeleting(eventId);
    try {
      const response = await fetch(`/api/events/delete?id=${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setEvents(events.filter((event) => event._id !== eventId));
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
        <Calendar className="mx-auto h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-700">No events yet</h3>
        <p className="mt-2 text-gray-500">Create your first event using the form above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-primary-800">Manage Events</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div
            key={event._id}
            className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
          >
            {event.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
            )}
            <div className="p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h4 className="text-xl font-bold text-primary-800">{event.title}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(event._id)}
                  disabled={deleting === event._id}
                  className="flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {deleting === event._id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="mb-4 line-clamp-2 text-gray-600">{event.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.date)}</span>
                  <span
                    className={`ml-auto rounded-full px-2 py-1 text-xs font-semibold ${
                      event.isUpcoming ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.isUpcoming ? "Upcoming" : "Past"}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
