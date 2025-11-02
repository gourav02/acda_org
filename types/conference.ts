import { LucideIcon } from "lucide-react";

export interface ConferenceSectionData {
  icon: LucideIcon;
  title: string;
  paragraphs: string[];
  image: {
    src: string;
    alt: string;
  };
  cta?: {
    text: string;
    href: string;
    icon: LucideIcon;
  };
}
