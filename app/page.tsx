"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/hero/Hero";
import ProjectsSection from "@/components/projects/ProjectsSection";
import ProofSection from "@/components/proof/ProofSection";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import PricingSection from "@/components/pricing/PricingSection";
import BookingWizard from "@/components/booking/BookingWizard";
import NewsletterSection from "@/components/contact/NewsletterSection";
import ContactSection from "@/components/contact/ContactSection";

export default function Home() {
  const [bookingTier, setBookingTier] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const openWizard = (tierId: string | null = null) => {
    setBookingTier(tierId);
    setWizardOpen(true);
  };

  return (
    <main>
      <Hero onBookProject={() => openWizard(null)} />
      <ProjectsSection />
      <ProofSection />
      <TestimonialsSection />
      <PricingSection onBook={openWizard} />
      <NewsletterSection />
      <ContactSection />
      <AnimatePresence>
        {wizardOpen && (
          <BookingWizard
            preselectTier={bookingTier}
            onClose={() => setWizardOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
