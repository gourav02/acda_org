import Image from "next/image";
import { Quote } from "lucide-react";
import { DirectorMessage } from "@/types";

const directors: DirectorMessage[] = [
  {
    name: "Dr. Rajesh Kumar",
    position: "Managing Director & Chief Diabetologist",
    message:
      "Our mission is to provide comprehensive diabetes care and empower our community with knowledge. Together, we can create a healthier future for the Asansol Coalfield region.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Priya Sharma",
    position: "Medical Director & Endocrinologist",
    message:
      "Prevention is better than cure. Through education, early detection, and compassionate care, we strive to reduce the burden of diabetes in our community.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Amit Banerjee",
    position: "Director of Community Outreach",
    message:
      "Every patient deserves personalized care and support. Our dedicated team works tirelessly to ensure that quality diabetes management is accessible to all.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
  },
];

export default function DirectorMessages() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 py-16 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111184' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-primary-800 sm:text-4xl lg:text-5xl">
            Message from Our Directors
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Leadership committed to excellence in diabetes care and community wellness
          </p>
        </div>

        {/* Directors Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {directors.map((director, index) => (
            <div
              key={index}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute right-6 top-6 opacity-10 transition-opacity group-hover:opacity-20">
                <Quote className="h-16 w-16 text-primary" />
              </div>

              {/* Director Photo */}
              <div className="relative z-10 mb-6 flex justify-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary-100 shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={director.image}
                    alt={director.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              </div>

              {/* Director Info */}
              <div className="relative z-10 mb-4 text-center">
                <h3 className="mb-1 text-xl font-bold text-primary-800">{director.name}</h3>
                <p className="text-sm font-medium text-primary-600">{director.position}</p>
              </div>

              {/* Message */}
              <div className="relative z-10 flex-1">
                <div className="relative">
                  <Quote className="absolute -left-2 -top-2 h-6 w-6 text-primary-300" />
                  <p className="pl-6 text-base leading-relaxed text-gray-700">{director.message}</p>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Optional: Call to Action */}
        <div className="mt-12 text-center lg:mt-16">
          <p className="text-lg text-gray-600">
            Want to learn more about our team?{" "}
            <a
              href="/about"
              className="font-semibold text-primary transition-colors hover:text-accent"
            >
              Visit our About page →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
