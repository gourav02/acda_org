import { ConferenceSectionData } from "@/types/conference";
import { ArrowRight, Focus } from "lucide-react";

export const organizationDirData: ConferenceSectionData = {
  icon: Focus,
  title: "Organization Directory",
  paragraphs: [
    "Our association is guided by an executive leadership team of seasoned diabetologists and healthcare administrators working in close collaboration.",
    "Regional coordinators and task forces ensure that programs reach physicians and communities across every district.",
    "All committees operate with a shared commitment to advancing diabetes care, education, and patient advocacy through transparent governance.",
  ],
  image: {
    src: "/images/dir.JPG",
    alt: "ACDACon - Annual Diabetes Conference",
  },
  cta: {
    text: "View full directory →",
    href: "/about",
    icon: ArrowRight,
  },
};
