import BookingLanding from "@/components/booking-site/BookingLanding";
import { getTestimonials } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const testimonials = await getTestimonials("booking");
  return <BookingLanding testimonials={testimonials} />;
}
