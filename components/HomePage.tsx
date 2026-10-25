"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/hero/Hero";
import ProjectsSection from "@/components/projects/ProjectsSection";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import GuaranteesSection from "@/components/guarantees/GuaranteesSection";
import PricingSection from "@/components/pricing/PricingSection";
import BookingWizard from "@/components/booking/BookingWizard";
import ContactFooter from "@/components/contact/ContactFooter";
import Tracker from "@/components/analytics/Tracker";
import type { Testimonial } from "@/lib/reviews";

export default function HomePage({ testimonials }: { testimonials: Testimonial[] }) {
  const [bookingTier, setBookingTier] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const openWizard = (tierId: string | null = null) => {
    setBookingTier(tierId);
    setWizardOpen(true);
  };

  return (
    <main>
      <Tracker site="portfolio" />
      <Navbar onBookProject={() => openWizard(null)} />
      <Hero onBookProject={() => openWizard(null)} />
      <ProjectsSection />
      <ReviewsSection testimonials={testimonials} />
      <HowItWorks />
      <GuaranteesSection />
      <PricingSection onBook={openWizard} />
      <ContactFooter onBookProject={() => openWizard(null)} />
      <AnimatePresence>
        {wizardOpen && <BookingWizard preselectTier={bookingTier} onClose={() => setWizardOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}
