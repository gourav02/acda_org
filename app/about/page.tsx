import { Activity, Target, Eye, Heart, Users, Calendar, Award, Stethoscope } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-700 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                <Activity className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              About ACDA
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-primary-100">
              Asansol Coalfield Diabetes Association
            </p>
            {/* <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
              Empowering communities through diabetes awareness, prevention, and quality care
            </p> */}
          </div>
        </div>
      </section>

      {/* ACDA- Asansol Coalfield Diabetes Association
Asansol Coalfield Diabetes Association (ACDA) is registered under Societies Act, Trust Act.
ACDA organizes events such as a Walkathon for World Diabetes Day, to raise awareness and educate the public about prevention and management of diabetes.
ACDACON conference description mentions that ACDA in addition to organizing various patient care programs on diabetes control, also shares platform to inculcate latest education in Diabetes Care and research in day to day practice.
registration under the Societies Registration act
Mission: To raise awareness about diabetes in the Asansol coalfield area; to promote prevention, early detection and better management of diabetes through education, patient care programs, and research.
Vision: A healthier community free from the avoidable complications of diabetes; increased access to quality diabetes care and empowered individuals who can manage or prevent diabetes effectively. */}

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-16 rounded-2xl bg-white p-8 shadow-lg md:p-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary-100 p-3">
                  <Heart className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="mb-4 text-3xl font-bold text-primary-800">Who We Are</h2>
                <p className="mb-4 text-lg leading-relaxed text-gray-700">
                  The <strong>Asansol Coalfield Diabetes Association (ACDA)</strong> is a registered
                  organization under Societies Act and Trust Act.
                </p>
                <p className="mb-4 text-lg leading-relaxed text-gray-700">
                  ACDA organizes events such as a Walkathon for World Diabetes Day, to raise
                  awareness and educate the public about prevention and management of diabetes.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  ACDACON conference description mentions that ACDA in addition to organizing
                  various patient care programs on diabetes control, also shares platform to
                  inculcate latest education in Diabetes Care and research in day to day practice.
                </p>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            {/* Mission Card */}
            <div className="group rounded-2xl bg-gradient-to-br from-primary to-primary-700 p-8 text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg leading-relaxed text-primary-50">
                To raise awareness about diabetes in the Asansol coalfield area; to promote
                prevention, early detection and better management of diabetes through education,
                patient care programs, and research.
              </p>
            </div>

            {/* Vision Card */}
            <div className="group rounded-2xl bg-gradient-to-br from-accent to-accent/90 p-8 text-primary shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Eye className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-lg leading-relaxed text-primary-800">
                A healthier community free from the avoidable complications of diabetes; increased
                access to quality diabetes care and empowered individuals who can manage or prevent
                diabetes effectively.
              </p>
            </div>
          </div>

          {/* Registration Info */}
          <div className="rounded-2xl bg-gradient-to-r from-primary-50 to-accent/10 p-8 shadow-md">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary p-4">
                  <Award className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="mb-2 text-2xl font-bold text-primary-800">
                  Officially Registered Organization
                </h3>
                <p className="text-lg text-gray-700">
                  ACDA is registered under the <strong>Societies Registration Act</strong> and{" "}
                  <strong>Trust Act</strong>, ensuring transparency, accountability, and commitment
                  to our mission of diabetes care and awareness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary to-primary-700 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Join Us in Our Mission</h2>
          <p className="mb-8 text-xl text-primary-100">
            Together, we can create a healthier community free from diabetes complications
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/membership"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3 text-lg font-semibold text-primary transition-colors hover:bg-accent/90"
            >
              Become a Member
            </a>
            <a
              href="/acdacon"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              Learn About ACDACON
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
