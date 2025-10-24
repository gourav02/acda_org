"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

// API fetcher function
const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetch("/api/events/list?type=all", { cache: "no-store" });
  const data = await res.json();
  if (!data.success) throw new Error("Failed to load events");
  return data.events;
};

// API delete function
const deleteEvent = async (id: string) => {
  const res = await fetch(`/api/events/delete?id=${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!data.success) throw new Error("Failed to delete event");
  return id;
};

export default function EventList() {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);

  // React Query - fetch + cache events
  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    retry: 2,
  });

  // ✅ Mutation for deleting events
  const mutation = useMutation({
    mutationFn: deleteEvent,
    onMutate: (eventId) => {
      setDeleting(eventId);
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Event[]>(["events"], (old = []) =>
        old.filter((e) => e._id !== deletedId)
      );
    },
    onError: () => {
      alert("Failed to delete event");
    },
    onSettled: () => {
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleDelete = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      mutation.mutate(eventId);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || events.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
        <Calendar className="mx-auto h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-700">
          {isError ? "Error loading events" : "No events yet"}
        </h3>
        <p className="mt-2 text-gray-500">
          {isError ? "Please try again later" : "Create your first event using the form above"}
        </p>
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
                  sizes="(max-width:768px) 100vw, 50vw"
                  loading="lazy"
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
