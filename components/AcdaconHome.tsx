"use client";

import { Calendar } from "lucide-react";

export default function AcdaconSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e40af' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Icon */}
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary-50 p-3">
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>

          {/* Heading */}
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            ACDACon – Annual Conference
          </h2>

          {/* Description */}
          <div className="space-y-6">
            <p className="flex items-start justify-start text-lg leading-relaxed text-gray-600">
              The ACDACon Annual Conference is the flagship event of the Association, bringing
              together eminent diabetologists, endocrinologists, nutrition experts, and healthcare
              professionals from across the world. Each year, ACDACon serves as a scientific forum
              to exchange the latest advances in diabetes research, clinical practices, and
              technological innovations. The conference features keynote lectures, paper
              presentations, workshops, and interactive sessions designed to foster learning and
              collaboration.
            </p>

            {/* Emphasis Statement */}
            <div className="mx-auto max-w-2xl">
              <p className="border-l-4 border-primary-600 bg-primary-50 py-4 pl-6 pr-4 text-base font-medium italic text-primary-800">
                ACDACon stands as a testament to our ongoing dedication to excellence in diabetes
                care and education.
              </p>
            </div>
          </div>

          {/* Optional: Call to Action */}
          <div className="mt-6 text-center lg:mt-10">
            <a
              href="/acdacon"
              className="font-semibold text-primary transition-colors hover:text-primary/60"
            >
              Visit our ACDACON Gallery →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
