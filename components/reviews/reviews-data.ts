// ⚠️ PLACEHOLDER — fictional stats and reviews for layout purposes only.
// Replace every number and quote with real ones before this goes live.

export const stats = [
  { label: "Projects delivered", value: "12+" },
  { label: "Average rating", value: "5.0" },
  { label: "Client retention", value: "90%" },
  { label: "Avg. response time", value: "2h" },
];

export type Review = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export const reviews: Review[] = [
  { id: "r1", name: "Client Name", role: "Founder, Company A", quote: "Placeholder — replace with a real testimonial about the outcome, not just the process.", rating: 5 },
  { id: "r2", name: "Client Name", role: "Ops Lead, Company B", quote: "Placeholder — ideally something specific: a number, a before/after, a deadline hit.", rating: 5 },
  { id: "r3", name: "Client Name", role: "PM, Company C", quote: "Placeholder — the strongest testimonials name the specific problem that got solved.", rating: 5 },
  { id: "r4", name: "Client Name", role: "CEO, Company D", quote: "Placeholder — keep these short in the final version, 1–2 sentences reads stronger.", rating: 5 },
];