import HomePage from "@/components/HomePage";
import { getTestimonials } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function Home() {
  const testimonials = await getTestimonials("portfolio");
  return <HomePage testimonials={testimonials} />;
}
