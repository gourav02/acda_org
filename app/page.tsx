import HeroCarousel from "@/components/HeroCarousel";
import DirectorMessages from "@/components/DirectorMessages";
import ContactUs from "@/components/ContactUs";
import WelcomeMsg from "@/components/WelcomeMsg";
import AcdaconSection from "@/components/AcdaconHome";
import EventsSection from "@/components/EventSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      <WelcomeMsg />

      {/* Director Messages Section */}
      <DirectorMessages />

      <EventsSection />

      <AcdaconSection />

      {/* CTA Section */}
      <ContactUs />
    </div>
  );
}
