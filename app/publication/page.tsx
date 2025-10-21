"use client";

import { BookOpen } from "lucide-react";

export default function PublicationsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section with Background Image */}
      <div className="relative h-[400px] overflow-hidden sm:h-[500px]">
        {/* Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/publication.jpeg')`,
            filter: "blur(4px)",
            transform: "scale(1.1)",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/20 p-3 backdrop-blur-sm">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
              Publications
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90 drop-shadow-md sm:text-xl">
              Empowering healthcare through knowledge and research
            </p>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e40af' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Description */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-600">
              ACDA believes in the power of knowledge dissemination. Our publications aim to keep
              healthcare professionals and the public informed about the latest in diabetes
              research, prevention, and management.
            </p>

            {/* Emphasis Statement */}
            <div className="mx-auto max-w-2xl">
              <p className="border-l-4 border-primary-600 bg-primary-50 py-4 pl-6 pr-4 text-base font-medium italic text-primary-800">
                Through every publication, we aim to empower readers with science-based
                understanding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
