// ⚠️ PLACEHOLDER PRICING — replace with your real rates before launch.

export type PricingTier = {
  id: string;
  name: string;
  price: string;
  period?: string;
  timeline: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    id: "landing",
    name: "Landing Pages",
    price: "$300",
    timeline: "3–5 days",
    description: "A single, focused page built to convert.",
    features: [
      "Custom design, no templates",
      "Mobile-first responsive build",
      "Basic on-page SEO",
      "1 round of revisions",
    ],
  },
  {
    id: "business",
    name: "Business Websites",
    price: "$800",
    timeline: "1–2 weeks",
    description: "Multi-page site for an established business.",
    features: [
      "Up to 6 pages",
      "CMS for easy content updates",
      "Contact forms & integrations",
      "SEO foundation + analytics",
    ],
  },
  {
    id: "webapp",
    name: "Web Applications",
    price: "$2,500",
    timeline: "3–5 weeks",
    description: "Custom logic, auth, and a real database.",
    features: [
      "User accounts & auth",
      "Database-backed features",
      "Admin dashboard",
      "API integrations",
    ],
    featured: true,
  },
  {
    id: "mobile",
    name: "Mobile Apps",
    price: "$3,500",
    timeline: "4–6 weeks",
    description: "Cross-platform iOS & Android from one codebase.",
    features: [
      "React Native / Expo build",
      "App store submission support",
      "Push notifications",
      "Backend API included",
    ],
  },
  {
    id: "saas",
    name: "SaaS Platforms",
    price: "$6,000",
    timeline: "6–10 weeks",
    description: "Multi-tenant product with billing built in.",
    features: [
      "Multi-tenant architecture",
      "Subscription billing (Stripe/M-Pesa)",
      "Role-based access control",
      "Usage analytics dashboard",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Systems",
    price: "Custom",
    timeline: "Scoped per project",
    description: "Complex internal systems built to spec.",
    features: [
      "Full technical discovery",
      "Custom architecture & integrations",
      "Dedicated support window",
      "Documentation & handoff",
    ],
  },
];
