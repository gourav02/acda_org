"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";

export default function AcdaconSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e40af' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading - Centered with Icon */}
        <div className="mb-12 text-center lg:mb-16">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary-50 p-3">
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            ACDACon – Annual Conference
          </h2>
        </div>

        {/* Text and Image Section */}
        <div className="mb-12 flex flex-col items-center gap-8 lg:mb-16 lg:flex-row lg:items-start lg:gap-12">
          {/* Left: Description Text */}
          <div className="w-full space-y-5 text-left lg:w-1/2">
            <p className="text-lg font-semibold leading-relaxed text-gray-800">
              The ACDACon Annual Conference is the flagship event of the Association, bringing
              together eminent diabetologists, endocrinologists, nutrition experts, and healthcare
              professionals from across the world.
            </p>

            <p className="text-base leading-relaxed text-gray-700">
              Each year, ACDACon serves as a scientific forum to exchange the latest advances in
              diabetes research, clinical practices, and technological innovations.
            </p>

            <p className="text-base leading-relaxed text-gray-700">
              The conference features keynote lectures, paper presentations, workshops, and
              interactive sessions designed to foster learning and collaboration among healthcare
              professionals committed to advancing diabetes care.
            </p>
          </div>

          {/* Right: Image */}
          <div className="w-full flex-shrink-0 lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/acdacon.jpeg"
                alt="ACDACon - Annual Diabetes Conference"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Quote Section - Centered */}
        <div className="mb-12 lg:mb-16">
          <div className="mx-auto max-w-4xl">
            <blockquote className="border-l-4 border-primary-600 bg-primary-50 py-6 pl-8 pr-6">
              <p className="text-xl italic leading-relaxed text-primary-900 sm:text-2xl">
                ACDACon stands as a testament to our ongoing dedication to excellence in diabetes
                care and education.
              </p>
            </blockquote>
          </div>
        </div>

        {/* Call to Action Button - Centered */}
        <div className="text-center">
          <a
            href="/acdacon"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Visit our ACDACON Gallery →
          </a>
        </div>
      </div>
    </section>
  );
}
