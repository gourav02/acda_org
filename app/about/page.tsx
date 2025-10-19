import { Activity, Target, Eye, Heart, Award, Focus } from "lucide-react";

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
              Welcome to Asansol Coalfield Diabetes Association (ACDA)
            </h1>
            {/* <p className="mx-auto max-w-3xl text-xl text-primary-100">
              Asansol Coalfield Diabetes Association
            </p> */}
            {/* <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
              Empowering communities through diabetes awareness, prevention, and quality care
            </p> */}
          </div>
        </div>
      </section>
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
                  Founded in 2019, with the vision of creating a diabetes-aware society, the{" "}
                  <strong>Asansol Coalfield Diabetes Association (ACDA)</strong> is dedicated to
                  diabetes prevention, education, and patient support.
                </p>
                <div className="mb-4">
                  <p className="mb-3 text-lg font-medium text-gray-800">
                    Our core objectives include:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                      <span className="text-base leading-relaxed">
                        Organizing the annual scientific International Conference - ACDACON
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                      <span className="text-base leading-relaxed">
                        Conducting educational workshops and awareness programs
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                      <span className="text-base leading-relaxed">
                        Promoting research and clinical excellence in diabetes management
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                      <span className="text-base leading-relaxed">
                        Supporting healthcare professionals through academic collaboration
                      </span>
                    </li>
                  </ul>
                </div>
                <p className="text-lg leading-relaxed text-gray-700">
                  ACDA functions as a bridge between medical science and community health,
                  addressing the growing challenges of diabetes in both urban and rural populations.
                </p>
                <p className="mt-5 text-lg leading-relaxed text-gray-700">
                  <i>
                    <strong>
                      Our guiding principle is simple — informed individuals makes healthier choices
                    </strong>
                  </i>
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
                The Asansol Coalfield Diabetes Association (ACDA) strives to: 1. Promote awareness
                and early detection of diabetes through education and outreach. 2. Strengthen
                professional collaboration among doctors and healthcare providers. 3. Encourage
                research and evidence-based practices in diabetes care. 4. Inspire ethical,
                patient-centered, and community-driven healthcare initiatives. Our mission is to
                unite science, service, and compassion for a diabetes-free tomorrow
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
                To build a healthier society where every individual — regardless of background or
                access — is empowered with the knowledge, care, and support needed to prevent and
                manage diabetes effectively. We envision ACDA as a leading regional platform for
                doctors, dietitians, and healthcare professionals to collaborate, share knowledge,
                and bring innovation to diabetes care in the Asansol and surrounding coalfield
                areas. A future where awareness replaces ignorance, prevention replaces fear, and
                compassionate care leads to healthier communities.
              </p>
            </div>
          </div>

          {/* Organization Directory */}
          <div className="mb-16 rounded-2xl bg-white p-8 shadow-lg md:p-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary-100 p-3">
                  <Focus className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="mb-4 text-3xl font-bold text-primary-800">Organization Directory</h2>
                <p className="mb-4 text-lg leading-relaxed text-gray-700">
                  Our Association is guided by a dedicated team of medical professionals and
                  community leaders who share a unified commitment to advancing diabetes care,
                  education, and awareness. Our leadership structure reflects collaboration,
                  transparency, and service to both the medical community and the public.
                </p>
              </div>
            </div>
          </div>

          {/* Executive Committee 2024-2025 */}
          <div className="mb-12">
            <h3 className="mb-6 text-2xl font-bold text-primary-700">
              Executive Committee (2024–2025)
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* President */}
              <div className="rounded-lg border-l-4 border-primary bg-primary-50 p-4 shadow-sm">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  President
                </p>
                <p className="text-lg font-bold text-gray-900">Dr. Subrata Bhattacharya (SR)</p>
              </div>

              {/* Vice President */}
              <div className="rounded-lg border-l-4 border-primary bg-primary-50 p-4 shadow-sm">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  Vice President
                </p>
                <p className="text-lg font-bold text-gray-900">Dr. V B Gupta</p>
              </div>

              {/* General Secretary */}
              <div className="rounded-lg border-l-4 border-primary bg-primary-50 p-4 shadow-sm">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  General Secretary
                </p>
                <p className="text-lg font-bold text-gray-900">Dr. Phalguni Goswami</p>
              </div>

              {/* Secretary */}
              <div className="rounded-lg border-l-4 border-primary bg-primary-50 p-4 shadow-sm">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  Secretary
                </p>
                <p className="text-lg font-bold text-gray-900">Dr. Siddharta Banerjee</p>
              </div>

              {/* Treasurer */}
              <div className="rounded-lg border-l-4 border-primary bg-primary-50 p-4 shadow-sm">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  Treasurer
                </p>
                <p className="text-lg font-bold text-gray-900">Dr. Raman Raj</p>
              </div>

              {/* Organizing Secretary */}
              <div className="rounded-lg border-l-4 border-primary bg-primary-50 p-4 shadow-sm">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  Organizing Secretary
                </p>
                <p className="text-lg font-bold text-gray-900">Dr. Satrajit Roy</p>
              </div>

              {/* Assistant Treasurer */}
              <div className="rounded-lg border-l-4 border-primary bg-primary-50 p-4 shadow-sm">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  Assistant Treasurer
                </p>
                <p className="text-lg font-bold text-gray-900">Dr. Shubhankar Mukherjee</p>
              </div>

              {/* Office Secretary */}
              <div className="rounded-lg border-l-4 border-accent bg-accent/10 p-4 shadow-sm">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  Office Secretary
                </p>
                <p className="text-lg font-bold text-gray-900">Megha Das(Dietician)</p>
              </div>
            </div>
          </div>

          {/* Executive Members */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-bold text-primary-700">Executive Members</h3>
            <p className="mb-6 text-base text-gray-600">
              The Executive Members actively contribute to academic initiatives, policy development,
              and event organization.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="font-medium text-gray-900">Dr. Shyamal Sanyal</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="font-medium text-gray-900">Dr. Dhruba Banerjee</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="font-medium text-gray-900">Dr. Partha Patim Das</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="font-medium text-gray-900">Dr. Souman Basu</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="font-medium text-gray-900">Dr. Prithwiraj Patra</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="font-medium text-gray-900">Dr. Debdweep Roy</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="font-medium text-gray-900">Dr. Subhadeep Ghosh</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="font-medium text-gray-900">Dr. Kaushik Sur</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="font-medium text-gray-900">Dr. Binidra Banerjee</p>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="mb-10">
            <h3 className="mb-4 text-2xl font-bold text-primary-700">Members</h3>
            <p className="mb-6 text-base leading-relaxed text-gray-700">
              The ACDA is strengthened by a growing body of physicians, diabetologists, dietitians,
              educators, and allied health professionals who work tirelessly toward a shared goal —
              reducing the burden of diabetes in the community through continuous education and
              compassionate care.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-primary-50/50 p-3">
                <p className="text-sm font-medium text-gray-800">Dr. Sayanti Banerjee</p>
              </div>
              <div className="rounded-lg bg-primary-50/50 p-3">
                <p className="text-sm font-medium text-gray-800">Dr. Nilanjan Mukherjee</p>
              </div>
              <div className="rounded-lg bg-primary-50/50 p-3">
                <p className="text-sm font-medium text-gray-800">Dr. Arijit Banerjee</p>
              </div>
              <div className="rounded-lg bg-primary-50/50 p-3">
                <p className="text-sm font-medium text-gray-800">Dr. Rupam KR Mondal</p>
              </div>
              <div className="rounded-lg bg-primary-50/50 p-3">
                <p className="text-sm font-medium text-gray-800">Dr. Monideepa Biswas</p>
              </div>
              <div className="rounded-lg bg-primary-50/50 p-3">
                <p className="text-sm font-medium text-gray-800">Dr. A K Pan</p>
              </div>
              <div className="rounded-lg bg-primary-50/50 p-3">
                <p className="text-sm font-medium text-gray-800">Dr. Y K Subhas Singh</p>
              </div>
              <div className="rounded-lg bg-primary-50/50 p-3">
                <p className="text-sm font-medium text-gray-800">Dr. Ravi Kant Jha</p>
              </div>
              <div className="rounded-lg bg-primary-50/50 p-3">
                <p className="text-sm font-medium text-gray-800">Dr. Subrata Bhattacharya (JR)</p>
              </div>
            </div>
            <p className="mt-8 text-center text-lg font-medium italic text-primary-700">
              Together, our members form the backbone of ACDA — a network united by knowledge,
              service, and empathy.
            </p>
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
    </div>
  );
}
