import EventGallery from "@/components/EventGallery";

export const metadata = {
  title: "ACDACon – Annual Conference",
  description:
    "The ACDACon Annual Conference is the flagship event of the Association, bringing together eminent diabetologists, endocrinologists, nutrition experts, and healthcare professionals from across the world. Each year, ACDACon serves as a scientific forum to exchange the latest advances in diabetes research, clinical practices, and technological innovations. The conference features keynote lectures, paper presentations, workshops, and interactive sessions designed to foster learning and collaboration",
};

export default function ACDACONPage() {
  return (
    <div className="flex flex-col">
      <EventGallery />
    </div>
  );
}
