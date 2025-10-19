"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { YEARS } from "@/lib/constants";

interface EventPhoto {
  _id: string;
  eventName: string;
  year: number;
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  year: number;
  description: string;
  images: string[];
}

const IMAGES_PER_PAGE = 6;

export default function EventGallery() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    event: Event;
    index: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Handle image load errors
  const handleImageError = (url: string) => {
    setImageErrors((prev) => new Set(prev).add(url));
  };

  // Fetch photos from API
  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true);
      setError(null);
      setImageErrors(new Set()); // Reset errors on new fetch
      try {
        const response = await fetch(`/api/events/photos?year=${selectedYear}`);
        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }
        const data = await response.json();
        setPhotos(data.photos || []);
      } catch (err) {
        console.error("Error fetching photos:", err);
        setError("Failed to load photos. Please try again later.");
        setPhotos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedYear]);

  // Group photos by event name
  const groupedEvents = useMemo(() => {
    const groups = photos.reduce(
      (acc, photo) => {
        if (!acc[photo.eventName]) {
          acc[photo.eventName] = {
            id: photo.eventName,
            title: photo.eventName,
            year: photo.year,
            description: `Photos from ${photo.eventName}`,
            images: [],
          };
        }
        acc[photo.eventName].images.push(photo.imageUrl);
        return acc;
      },
      {} as Record<string, Event>
    );
    return Object.values(groups);
  }, [photos]);

  // Flatten all images from grouped events
  const allImages = useMemo(() => {
    return groupedEvents.flatMap((event) =>
      event.images.map((image, index) => ({
        url: image,
        event,
        index,
      }))
    );
  }, [groupedEvents]);

  // Pagination logic
  const totalPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const displayedImages = allImages.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
    setCurrentPage(1); // Reset to first page when year changes
  };

  return (
    <section className="container mx-auto my-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Gallery Section */}
        <div className="mb-12">
          <div className="mb-6 flex justify-between">
            <h2 className="flex items-center justify-center text-3xl font-bold text-gray-900 sm:text-4xl">
              ACDACON Gallery
            </h2>
            {/* Year Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Select Year</label>
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-full border-gray-300 bg-white shadow-sm hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:w-[200px]">
                  <Calendar className="mr-2 h-5 w-5 text-primary-600" />
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex min-h-[500px] items-center justify-center rounded-lg bg-gray-50">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary-600" />
              <p className="text-base font-medium text-gray-600">Loading photos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <Calendar className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Error Loading Photos</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : displayedImages.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedImages.map((item, idx) => (
                <div
                  key={`${item.event.id}-${item.index}-${idx}`}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
                  onClick={() => setSelectedImage(item)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    {imageErrors.has(item.url) ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-center">
                          <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                          <p className="mt-3 text-sm text-gray-500">Image unavailable</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={item.url}
                          alt={item.event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                          unoptimized
                          onError={() => handleImageError(item.url)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="p-4">
                    <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-primary-700">
                      {item.event.title}
                    </h3>
                    <p className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      {item.event.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <nav className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={
                          currentPage === page
                            ? "bg-primary-600 text-white hover:bg-primary-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
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
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            )}
          </>
        ) : (
          // No images message
          <div className="rounded-lg bg-gray-50 py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No events found for {selectedYear}
            </h3>
            <p className="text-gray-600">Please select a different year to view event photos.</p>
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedImage?.event.title}
            </DialogTitle>
            <DialogDescription className="flex items-center text-base text-gray-600">
              {selectedImage?.event.description}
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4" />
                {selectedImage?.event.year}
              </span>
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-gray-100">
              {imageErrors.has(selectedImage.url) ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <Calendar className="mx-auto h-16 w-16 text-gray-300" />
                    <p className="mt-4 text-base font-medium text-gray-700">
                      Image temporarily unavailable
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Please try refreshing the page</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.event.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  unoptimized
                  onError={() => handleImageError(selectedImage.url)}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
