"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  imageUrls?: string[];
  isUpcoming: boolean;
}

// API Fetcher with caching support
async function fetchEvents(type: "upcoming" | "past") {
  const res = await fetch(`/api/events/list?type=${type}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch events");
  const data = await res.json();
  if (!data.success) throw new Error("API returned an error");
  return data.events as Event[];
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 3;

  // React Query data fetching & caching
  const { data: upcomingEvents = [], isLoading: loadingUpcoming } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: () => fetchEvents("upcoming"),
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const { data: pastEvents = [], isLoading: loadingPast } = useQuery({
    queryKey: ["events", "past"],
    queryFn: () => fetchEvents("past"),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedEvent]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const handlePrevImage = () => {
    if (selectedEvent?.imageUrls) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedEvent.imageUrls!.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (selectedEvent?.imageUrls) {
      setCurrentImageIndex((prev) => (prev === selectedEvent.imageUrls!.length - 1 ? 0 : prev + 1));
    }
  };

  const loading = loadingUpcoming || loadingPast;
  const displayEvents = activeTab === "upcoming" ? (upcomingEvents ?? []) : (pastEvents ?? []);
  const totalPages = Math.ceil(displayEvents.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const paginatedEvents = displayEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden py-20">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <Image
            src="/images/events.jpg"
            alt="Events background"
            fill
            className="object-cover blur-sm"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary-700/35 to-primary/40" />
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                <Calendar className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
              Our Events
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-white drop-shadow-md">
              Join us in our mission to raise awareness and promote diabetes care through community
              events
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="mb-12 flex justify-center gap-4">
            <Button
              onClick={() => setActiveTab("upcoming")}
              variant={activeTab === "upcoming" ? "default" : "outline"}
              size="lg"
              className={
                activeTab === "upcoming"
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "border-primary text-primary hover:bg-primary/10"
              }
            >
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Events ({upcomingEvents.length})
            </Button>
            <Button
              onClick={() => setActiveTab("past")}
              variant={activeTab === "past" ? "default" : "outline"}
              size="lg"
              className={
                activeTab === "past"
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "border-primary text-primary hover:bg-primary/10"
              }
            >
              <Clock className="mr-2 h-5 w-5" />
              Past Events ({pastEvents.length})
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : displayEvents.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-700">No {activeTab} events</h3>
              <p className="text-gray-500">
                {activeTab === "upcoming"
                  ? "Check back soon for upcoming events"
                  : "Past events will appear here"}
              </p>
            </div>
          ) : (
            <>
              {/* Events Grid */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {paginatedEvents.map((event, index) => (
                  <div
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Event Image */}
                    {event.imageUrls && event.imageUrls.length > 0 ? (
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={event.imageUrls[0]}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {/* Date Badge */}
                        <div className="absolute right-4 top-4 rounded-lg bg-white px-3 py-2 shadow-lg">
                          <p className="text-center text-xs font-semibold text-gray-600">
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                          </p>
                          <p className="text-center text-2xl font-bold text-primary">
                            {new Date(event.date).getDate()}
                          </p>
                        </div>
                        {/* Image Count Badge */}
                        {event.imageUrls.length > 1 && (
                          <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            +{event.imageUrls.length} photos
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <Calendar className="h-20 w-20 text-primary-400" />
                      </div>
                    )}

                    {/* Event Content */}
                    <div className="p-6">
                      <h3 className="mb-3 line-clamp-2 text-xl font-bold text-primary-800 transition-colors group-hover:text-primary">
                        {event.title}
                      </h3>

                      <p className="mb-4 line-clamp-3 text-gray-600">{event.description}</p>

                      {/* Event Meta */}
                      <div className="space-y-2 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
                          <span className="font-medium">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
                          <span>{formatTime(event.date)}</span>
                        </div>
                        <a
                          href={event.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-1 flex items-center justify-center gap-2 text-primary hover:underline"
                        >
                          <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                          <span className="line-clamp-1">{event.location}</span>
                        </a>
                      </div>

                      {/* Status Badge */}
                      {activeTab === "upcoming" && (
                        <div className="mt-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />
                            Upcoming Event
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className={
                          currentPage === page
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "border-primary text-primary hover:bg-primary/10"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Event Detail Dialog with Image Carousel */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="flex h-[90vh] max-w-6xl flex-col gap-0 p-0">
          {/* Header - Fixed */}
          <DialogHeader className="border-b bg-white px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-primary-800 sm:text-3xl">
                  {selectedEvent?.title}
                </DialogTitle>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {selectedEvent && formatDate(selectedEvent.date)}
                    </span>
                  </span>
                  {selectedEvent?.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{selectedEvent.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {selectedEvent && (
              <div className="space-y-6">
                {/* Image Carousel */}
                {selectedEvent.imageUrls && selectedEvent.imageUrls.length > 0 && (
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 shadow-lg">
                      <Image
                        src={selectedEvent.imageUrls[currentImageIndex]}
                        alt={`${selectedEvent.title} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1536px) 100vw, 1280px"
                      />

                      {/* Navigation Arrows */}
                      {selectedEvent.imageUrls.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 shadow-xl transition-all hover:scale-110 hover:bg-white"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-6 w-6 text-primary" />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 shadow-xl transition-all hover:scale-110 hover:bg-white"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-6 w-6 text-primary" />
                          </button>

                          {/* Image Counter */}
                          <div className="absolute bottom-4 right-4 rounded-lg bg-black/75 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                            {currentImageIndex + 1} / {selectedEvent.imageUrls.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {selectedEvent.imageUrls.length > 1 && (
                      <div className="overflow-x-auto pb-2">
                        <div className="flex gap-3">
                          {selectedEvent.imageUrls.map((url, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                                currentImageIndex === index
                                  ? "scale-105 ring-4 ring-primary ring-offset-2"
                                  : "opacity-60 hover:scale-105 hover:opacity-100"
                              }`}
                            >
                              <Image
                                src={url}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="112px"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Event Description */}
                <div className="rounded-xl bg-gradient-to-br from-primary-50 to-white p-6 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-primary-800">
                    <div className="h-1 w-1 rounded-full bg-primary"></div>
                    About This Event
                  </h3>
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Event Details Card */}
                <div className="grid gap-4 rounded-xl border-2 border-primary-200 bg-white p-6 shadow-sm md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600">
                      <Calendar className="h-4 w-4" />
                      Date & Day
                    </h4>
                    <p className="text-base font-medium text-gray-800">
                      {formatTime(selectedEvent.date)}
                    </p>
                    <p className="text-sm text-gray-600">{formatDate(selectedEvent.date)}</p>
                  </div>
                  {selectedEvent.location && (
                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600">
                        <MapPin className="h-4 w-4" />
                        Location
                      </h4>
                      <a
                        href={selectedEvent.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="line-clamp-1 text-primary hover:underline"
                      >
                        <p className="text-base font-medium text-gray-800">
                          {selectedEvent.location}
                        </p>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
