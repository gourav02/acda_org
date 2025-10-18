import MembershipForm from "@/components/MembershipForm";

export const metadata = {
  title: "Membership Application - Asansol Coalfield Diabetes Association",
  description:
    "Apply for membership at ACDACON and join our mission to provide quality diabetes care and awareness in the Asansol Coalfield region.",
};

export default function MembershipPage() {
  return (
    <div className="flex flex-col">
      <MembershipForm />
    </div>
  );
}
