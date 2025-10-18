"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { type CarouselApi } from "@/components/ui/carousel";

const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop",
    alt: "Medical professionals providing diabetes care",
  },
  {
    src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&h=1080&fit=crop",
    alt: "Healthcare consultation and patient care",
  },
  {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&h=1080&fit=crop",
    alt: "Modern medical facility and equipment",
  },
  {
    src: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1920&h=1080&fit=crop",
    alt: "Diabetes awareness and community support",
  },
];

export default function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative w-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {carouselImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
                {/* Image */}
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                      Asansol Coalfield Diabetes Association
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-gray-100 sm:text-xl md:text-2xl">
                      Committed to Diabetes Care & Awareness
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                      <button className="rounded-lg bg-accent px-6 py-3 text-base font-semibold text-primary shadow-lg transition-all hover:bg-accent/90 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg">
                        Learn More
                      </button>
                      <button className="rounded-lg border-2 border-white bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:px-8 sm:py-4 sm:text-lg">
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows - hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 h-12 w-12 border-2 border-white bg-white/20 text-white backdrop-blur-sm hover:bg-white/30" />
          <CarouselNext className="right-4 h-12 w-12 border-2 border-white bg-white/20 text-white backdrop-blur-sm hover:bg-white/30" />
        </div>
      </Carousel>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              current === index ? "w-8 bg-white" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
