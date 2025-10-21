import Image from "next/image";

export default function WelcomeMsg() {
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
        {/* Heading - Centered */}
        <div className="mb-12 text-center lg:mb-16">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-blue-900 sm:text-5xl lg:text-6xl">
            Welcome to{" "}
            <span className="block text-blue-900">Asansol Coalfield Diabetes Association</span>
          </h1>
          <p className="text-xl font-medium text-blue-900 sm:text-2xl">(ACDA)</p>
        </div>

        {/* Image and Description Section */}
        <div className="mb-12 flex flex-col items-center gap-8 lg:mb-16 lg:flex-row lg:items-start lg:gap-12">
          {/* Left: Image */}
          <div className="w-full flex-shrink-0 lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/welcome.jpeg"
                alt="ACDA - Asansol Coalfield Diabetes Association"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Right: Description Text */}
          <div className="w-full space-y-5 text-left lg:w-1/2">
            <p className="text-lg font-semibold leading-relaxed text-gray-800">
              The Asansol Coalfield Diabetes Association (ACDA) is a premier medical organization
              dedicated to advancing diabetes care, education, and awareness in the Asansol and
              coalfield regions of India.
            </p>

            <p className="text-base leading-relaxed text-gray-700">
              Since its inception, ACDA has been committed to empowering communities through
              scientific engagement, preventive health programs, and evidence-based education.
            </p>

            <p className="text-base leading-relaxed text-gray-700">
              Through collaborative efforts with healthcare professionals, researchers, and public
              health agencies, we strive to reduce the burden of diabetes and its complications.
              ACDA organizes regular screening camps, public awareness initiatives, and the annual
              ACDA Conference, which brings together leading experts in the field of diabetology and
              metabolic health from all over the world.
            </p>
          </div>
        </div>

        {/* Quote Section - Centered */}
        <div className="mb-12 lg:mb-16">
          <div className="mx-auto max-w-4xl">
            <blockquote className="border-l-4 border-blue-600 bg-blue-50 py-6 pl-8 pr-6">
              <p className="text-xl italic leading-relaxed text-blue-900 sm:text-2xl">
                Together, we envision a healthier tomorrow — where awareness, prevention, and early
                intervention shape the future of diabetes care.
              </p>
            </blockquote>
          </div>
        </div>

        {/* Call to Action Button - Centered */}
        <div className="text-center">
          <a
            href="/about"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Learn More About Our Team →
          </a>
        </div>
      </div>
    </section>
  );
}
