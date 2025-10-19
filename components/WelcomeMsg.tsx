export default function WelcomeMsg() {
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

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Main Content */}
        <div className="text-center">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-blue-900 sm:text-5xl lg:text-6xl">
              Welcome to{" "}
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Asansol Coalfield Diabetes Association
              </span>
            </h1>
            <p className="text-xl font-medium text-blue-700 sm:text-2xl">(ACDA)</p>
          </div>

          {/* Introduction */}
          <div className="mx-auto max-w-4xl space-y-6 text-lg leading-relaxed text-gray-700">
            <p className="text-xl font-medium text-gray-800">
              The Asansol Coalfield Diabetes Association (ACDA) is a premier medical organization
              dedicated to advancing diabetes care, education, and awareness in the Asansol and
              coalfield regions of India.
            </p>

            <p>
              Since its inception, ACDA has been committed to empowering communities through
              scientific engagement, preventive health programs, and evidence-based education.
            </p>

            <p>
              Through collaborative efforts with healthcare professionals, researchers, and public
              health agencies, we strive to reduce the burden of diabetes and its complications.
              ACDA organizes regular screening camps, public awareness initiatives, and the annual
              ACDA Conference, which brings together leading experts in the field of diabetology and
              metabolic health from all over the world.
            </p>

            <p className="pt-4 text-xl font-semibold text-blue-800">
              Together, we envision a healthier tomorrow — where awareness, prevention, and early
              intervention shape the future of diabetes care.
            </p>
          </div>
        </div>

        {/* Optional: Call to Action */}
        <div className="mt-12 text-center lg:mt-16">
          <p className="text-lg text-gray-600">
            Want to learn more about our team?{" "}
            <a
              href="/about"
              className="font-semibold text-primary transition-colors hover:text-primary/60"
            >
              Visit our About page →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
