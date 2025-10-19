export default function ContactUs() {
  return (
    <section className="bg-gradient-to-r py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold md:text-4xl">Membership Information</h2>
        <p className="text-lg leading-relaxed text-gray-600">
          The Asansol Coalfield Diabetes Association (ACDA) envisions building a strong network of
          healthcare professionals dedicated to improving diabetes care, research, and education in
          the region. At present, the Association’s membership framework is being developed to
          ensure that it aligns with our mission of inclusivity, collaboration, and professional
          growth. Once finalized, details regarding eligibility, categories of membership,
          application procedures, and associated benefits will be made available on this page. We
          look forward to welcoming physicians, diabetologists, nutritionists, educators, and allied
          health professionals who share our commitment to advancing diabetes awareness and patient
          care. Stay connected. Updates on membership enrolment will be announced soon.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/membership"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Become a Member
          </a>
        </div>
      </div>
    </section>
  );
}
