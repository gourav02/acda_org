import Image from "next/image";
import { ArrowRight, Users } from "lucide-react";

export default function ContactUs() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      {/* Content */}
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <Users className="h-4 w-4" />
              <span>Join Our Network</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Membership Information
            </h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          </div>

          {/* Hero Image Section */}
          <div className="mb-12 overflow-hidden rounded-2xl shadow-xl">
            <div className="relative h-96 w-full sm:h-[500px] lg:h-[600px]">
              <Image
                src="/images/membership.JPG"
                alt="Membership background"
                fill
                className="object-cover"
                quality={90}
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-indigo-600/20" />
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-12 rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm lg:p-10">
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              The Asansol Coalfield Diabetes Association (ACDA) envisions building a strong network
              of healthcare professionals dedicated to improving diabetes care, research, and
              education in the region.
            </p>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              At present, the Association`s membership framework is being developed to ensure that
              it aligns with our mission of inclusivity, collaboration, and professional growth.
              Once finalized, details regarding eligibility, categories of membership, application
              procedures, and associated benefits will be made available on this page.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              We look forward to welcoming physicians, diabetologists, nutritionists, educators, and
              allied health professionals who share our commitment to advancing diabetes awareness
              and patient care.
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-500">
              Updates on membership enrollment will be announced soon
            </p>
            <a
              href="/membership"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            >
              <span>Become a Member</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
