import { Quote } from "lucide-react";
import { DirectorMessage } from "@/types";

const directors: DirectorMessage[] = [
  {
    name: "Dr. Subrata Bhattacharya (Senior)",
    position: "President, Asansol Coalfield Diabetes Association",
    message:
      "It gives me immense pleasure to welcome you to the official website of the Asansol Coalfield Diabetes Association (ACDA). Over the years, ACDA has evolved into a platform that unites clinicians, researchers, dietitians, and public health advocates toward one shared goal — to improve the lives of individuals affected by diabetes. Our mission is to unite science, service, and compassion for a diabetes-free tomorrow. The collective strength of our members and the trust of the community continue to inspire our work. As we move forward, we remain steadfast in our commitment to research, education, and service. I invite you to join hands with us in creating greater awareness and promoting a culture of health and wellness across our region.",
    image: "",
  },
];

export default function DirectorMessages() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 py-16 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-primary-400 opacity-[0.03]">
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
            Message from the President, ACDA
          </h2>
          {/* <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Leadership committed to excellence in diabetes care and community wellness
          </p> */}
        </div>

        {/* Directors Row - Horizontal Layout */}
        <div className="flex flex-col gap-8 md:gap-10">
          {directors.map((director, index) => (
            <div
              key={index}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl md:flex-row md:items-start md:gap-8"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute right-6 top-6 opacity-10 transition-opacity group-hover:opacity-20">
                <Quote className="h-16 w-16 text-primary" />
              </div>

              {/* Director Photo */}
              {/* <div className="relative z-10 mb-6 flex justify-center md:mb-0 md:flex-shrink-0">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary-100 shadow-lg transition-transform duration-300 group-hover:scale-105 md:h-40 md:w-40">
                  <Image
                    src={director.image}
                    alt={director.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 128px, 160px"
                  />
                </div>
              </div> */}

              {/* Director Content */}
              <div className="relative z-10 flex flex-1 flex-col">
                {/* Director Info */}
                <div className="mb-4 text-center md:text-left">
                  <h3 className="mb-1 text-xl font-bold text-primary-800">{director.name}</h3>
                  <p className="text-sm font-medium text-primary-600">{director.position}</p>
                </div>

                {/* Message */}
                <div className="flex-1">
                  <div className="relative">
                    <Quote className="absolute -left-2 -top-2 h-6 w-6 text-primary-300" />
                    <p className="pl-6 text-base leading-relaxed text-gray-700">
                      {director.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
