// ⚠️ PLACEHOLDER DATA — these are fictional names/quotes standing in for
// layout purposes only. Replace every entry with a real client testimonial
// before this section goes live.

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number; // out of 5
  gradient: string;
  logoInitial: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Client Name",
    role: "Founder",
    company: "Company A",
    quote:
      "Placeholder quote — replace with a real testimonial about the outcome, not just the process.",
    rating: 5,
    gradient: "from-violet-500 to-magenta-500",
    logoInitial: "A",
  },
  {
    id: "t2",
    name: "Client Name",
    role: "Operations Lead",
    company: "Company B",
    quote:
      "Placeholder quote — ideally something specific: a number, a before/after, a deadline hit.",
    rating: 5,
    gradient: "from-violet-300 to-violet-700",
    logoInitial: "B",
  },
  {
    id: "t3",
    name: "Client Name",
    role: "Product Manager",
    company: "Company C",
    quote:
      "Placeholder quote — the strongest testimonials name the specific problem that got solved.",
    rating: 5,
    gradient: "from-magenta-500 to-violet-700",
    logoInitial: "C",
  },
  {
    id: "t4",
    name: "Client Name",
    role: "CEO",
    company: "Company D",
    quote:
      "Placeholder quote — keep these short in the final version, 1–2 sentences reads stronger.",
    rating: 5,
    gradient: "from-violet-500 to-blue-500",
    logoInitial: "D",
  },
];
