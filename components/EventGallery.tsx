"use client";

import { useState, useMemo } from "react";
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
import { useQuery } from "@tanstack/react-query";

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

// API fetcher
const fetchPhotos = async (year: number) => {
  const res = await fetch(`/api/events/photos?year=${year}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch photos");
  const data = await res.json();
  return data.photos as EventPhoto[];
};

export default function EventGallery() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    event: Event;
    index: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // React Query: Fetch + Cache photos by year
  const {
    data: photos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["photos", selectedYear],
    queryFn: () => fetchPhotos(selectedYear),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });

  const handleImageError = (url: string) => {
    setImageErrors((prev) => new Set(prev).add(url));
  };

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

  const allImages = useMemo(() => {
    return groupedEvents.flatMap((event) =>
      event.images.map((image, index) => ({
        url: image,
        event,
        index,
      }))
    );
  }, [groupedEvents]);

  const totalPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const displayedImages = allImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
    setCurrentPage(1);
  };

  return (
    <section className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900 sm:h-[600px]">
        <div
          className="absolute inset-0 scale-[1.02] bg-cover bg-center blur-[1px]"
          style={{ backgroundImage: `url('/images/con.JPG')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                ACDACON Gallery
              </h1>
              <p className="text-lg text-white/90 sm:text-xl">
                <i>
                  ACDACon stands as a testament to our ongoing dedication to excellence in diabetes
                  care and education.
                </i>
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{photos.length}</div>
                  <div className="text-sm text-white/80">Photos</div>
                </div>
                <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{groupedEvents.length}</div>
                  <div className="text-sm text-white/80">Events</div>
                </div>
                <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{YEARS.length}</div>
                  <div className="text-sm text-white/80">Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Filter */}
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Event Photos</h2>
              <p className="mt-1 text-sm text-gray-600">
                Browse through our collection of memorable moments
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Year</label>
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-full border-gray-300 bg-white shadow-sm sm:w-[200px]">
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

          {/* States */}
          {isLoading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
            </div>
          ) : isError ? (
            <div className="rounded-lg bg-red-50 py-20 text-center">
              <Calendar className="mx-auto mb-4 h-10 w-10 text-red-500" />
              <h3 className="text-xl font-semibold text-gray-900">Error Loading Photos</h3>
              <p className="text-gray-600">Failed to load photos. Please try again later.</p>
            </div>
          ) : displayedImages.length > 0 ? (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayedImages.map((item, idx) => (
                  <div
                    key={`${item.event.id}-${item.index}-${idx}`}
                    className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
                    onClick={() => setSelectedImage(item)}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      {imageErrors.has(item.url) ? (
                        <div className="flex h-full w-full items-center justify-center">
                          <p className="text-sm text-gray-500">Image unavailable</p>
                        </div>
                      ) : (
                        <Image
                          src={item.url}
                          alt={item.event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                          loading="lazy"
                          onError={() => handleImageError(item.url)}
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
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
                <div className="mt-12 flex justify-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      className={
                        currentPage === i + 1
                          ? "bg-primary-600 text-white hover:bg-primary-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg bg-gray-50 py-20 text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                No events found for {selectedYear}
              </h3>
              <p className="text-gray-600">Please select another year.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedImage?.event.title}
            </DialogTitle>
            <DialogDescription className="flex items-center text-base text-gray-600">
              {selectedImage?.event.description} • {selectedImage?.event.year}
            </DialogDescription>
          </DialogHeader>

          {selectedImage && (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-gray-100">
              {imageErrors.has(selectedImage.url) ? (
                <p className="mt-8 text-center text-gray-500">Image temporarily unavailable</p>
              ) : (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.event.title}
                  fill
                  className="object-contain"
                  sizes="(max-width:1024px) 100vw, 1024px"
                  priority
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
