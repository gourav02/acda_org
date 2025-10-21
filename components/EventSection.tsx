export default function EventsSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-primary-800 sm:text-4xl lg:text-5xl">
            Events
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Each event reflects our unwavering dedication to creating a healthier, better-informed
            community
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Diabetes Awareness Camps */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-primary-50 to-white p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-primary-800">
              Diabetes Awareness Camps
            </h3>
            <p className="text-gray-600">
              Free blood sugar testing and counselling for early detection
            </p>
          </div>

          {/* Community Outreach */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-primary-50 to-white p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-primary-800">Community Outreach</h3>
            <p className="text-gray-600">
              Educating students and families on healthy lifestyle habits
            </p>
          </div>

          {/* CME Programs */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-primary-50 to-white p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-primary-800">
              Continuing Medical Education
            </h3>
            <p className="text-gray-600">Interactive learning for healthcare professionals</p>
          </div>

          {/* World Diabetes Day */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-primary-50 to-white p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-primary-800">
              World Diabetes Day Observance
            </h3>
            <p className="text-gray-600">Public rallies, lectures, and health exhibitions</p>
          </div>

          {/* Collaborative Projects */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-primary-50 to-white p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-primary-800">Collaborative Projects</h3>
            <p className="text-gray-600">
              Partnerships with hospitals, NGOs, and research institutes
            </p>
          </div>

          {/* Additional Initiative Placeholder */}
          <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-primary-50 to-white p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-primary-800">
              Prevention & Care Programs
            </h3>
            <p className="text-gray-600">
              Comprehensive initiatives focused on diabetes prevention and patient care
            </p>
          </div>
        </div>

        <div className="mt-12 flex w-full items-center justify-center lg:mt-16">
          <a
            href="/events"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Checkout Events
          </a>
        </div>
      </div>
    </section>
  );
}
