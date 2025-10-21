"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  imageUrl?: string;
  isUpcoming: boolean;
}

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          fetch("/api/events/list?type=upcoming"),
          fetch("/api/events/list?type=past"),
        ]);

        const upcomingData = await upcomingRes.json();
        const pastData = await pastRes.json();

        if (upcomingData.success) {
          setUpcomingEvents(upcomingData.events);
        }
        if (pastData.success) {
          setPastEvents(pastData.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Reset to page 1 when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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

  const displayEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  // Pagination logic
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-200 py-24 md:py-32">
        {/* Background Image */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="/images/events.jpg"
            alt="Events Background"
            fill
            className="object-cover object-center"
            priority
            quality={95}
            sizes="100vw"
          />
          {/* Medium backdrop overlay */}
          <div className="absolute inset-0 bg-primary/70 backdrop-blur-[2px]" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                <Calendar className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Events and Activities
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-white/90">
              ACDA conducts a wide range of community and academic activities throughout the year to
              fulfill its mission of education and prevention
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
                    {event.imageUrl ? (
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Date Badge */}
                        <div className="absolute right-4 top-4 rounded-lg bg-white px-3 py-2 shadow-lg">
                          <p className="text-center text-xs font-semibold text-gray-600">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </p>
                          <p className="text-center text-2xl font-bold text-primary">
                            {new Date(event.date).getDate()}
                          </p>
                        </div>
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
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                            <a
                              href={event.location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="line-clamp-1 text-primary hover:underline"
                            >
                              {event.location}
                            </a>
                          </div>
                        )}
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

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary-800">
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {selectedEvent && formatDate(selectedEvent.date)}
                </span>
                {selectedEvent?.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <a
                      href={selectedEvent.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="line-clamp-1 text-primary hover:underline"
                    >
                      {selectedEvent.location}
                    </a>
                  </span>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {selectedEvent.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 896px"
                    unoptimized
                  />
                </div>
              )}
              <div className="prose max-w-none">
                <p className="leading-relaxed text-gray-700">{selectedEvent.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
