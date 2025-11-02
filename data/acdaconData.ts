import { ConferenceSectionData } from "@/types/conference";
import { ArrowRight, Calendar } from "lucide-react";

export const acdaconData: ConferenceSectionData = {
  icon: Calendar,
  title: "ACDACon – Annual Conference",
  paragraphs: [
    "The ACDACon Annual Conference is the flagship event of the Association, bringing together eminent diabetologists, endocrinologists, nutrition experts, and healthcare professionals from across the world.",
    "Each year, ACDACon serves as a scientific forum to exchange the latest advances in diabetes research, clinical practices, and technological innovations.",
    "The conference features keynote lectures, paper presentations, workshops, and interactive sessions designed to foster learning and collaboration among healthcare professionals committed to advancing diabetes care.",
  ],
  image: {
    src: "/images/acdacon.jpeg",
    alt: "ACDACon - Annual Diabetes Conference",
  },
  cta: {
    text: "Visit our ACDACON Gallery →",
    href: "/acdacon",
    icon: ArrowRight,
  },
};
