import EventGallery from "@/components/EventGallery";

export const metadata = {
  title: "ACDACON Event Gallery - Asansol Coalfield Diabetes Association",
  description:
    "Browse photos from our community health camps, awareness programs, and diabetes care initiatives.",
};

export default function ACDACONPage() {
  return (
    <div className="flex flex-col">
      <EventGallery />
    </div>
  );
}
