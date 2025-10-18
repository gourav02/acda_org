import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, Clock } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import DirectorMessages from "@/components/DirectorMessages";

export default function Home() {
  const features = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description:
        "Our dedicated team provides personalized healthcare with empathy and understanding.",
    },
    {
      icon: Shield,
      title: "Advanced Technology",
      description: "State-of-the-art medical equipment and innovative treatment approaches.",
    },
    {
      icon: Users,
      title: "Expert Professionals",
      description: "Board-certified physicians and healthcare specialists committed to excellence.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock emergency services and support when you need it most.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Director Messages Section */}
      <DirectorMessages />

      {/* Features Section */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-800">Why Choose Us</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We combine medical excellence with personalized care to ensure the best outcomes for
              our patients.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg transition-shadow hover:shadow-xl">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-800">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Schedule your appointment today and take the first step towards better health.
          </p>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
            Contact Us Today
          </Button>
        </div>
      </section>
    </div>
  );
}
