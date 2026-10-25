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

// Ids match ProjectType in booking-types.ts so "Book This Service" preselects the wizard.
export const pricingTiers: PricingTier[] = [
  {
    id: "business",
    name: "Websites",
    price: "KES 80,000",
    timeline: "Fixed price after scoping",
    description: "Corporate websites, marketing sites, portals and content platforms.",
    features: [
      "Custom design, no templates",
      "Mobile-first responsive build",
      "SEO foundation + analytics",
      "Hosting & deployment setup",
    ],
  },
  {
    id: "webapp",
    name: "Web Applications",
    price: "KES 200,000",
    timeline: "Fixed price after scoping",
    description: "Dashboards, platforms, management systems and SaaS products.",
    features: [
      "User accounts & authentication",
      "Database & API architecture",
      "Admin dashboard",
      "M-Pesa / Stripe payments",
    ],
    featured: true,
  },
  {
    id: "mobile",
    name: "Mobile Apps",
    price: "KES 250,000",
    timeline: "Fixed price after scoping",
    description: "Android, iOS and cross-platform customer-facing apps.",
    features: [
      "React Native / Expo build",
      "Backend API included",
      "Push notifications",
      "App store submission support",
    ],
  },
  {
    id: "enterprise",
    name: "Custom Software",
    price: "KES 300,000",
    timeline: "Fixed price after scoping",
    description: "ERP, CRM, HR, inventory, operations and workflow automation.",
    features: [
      "Full discovery & requirements",
      "Custom architecture & integrations",
      "Migration from existing systems",
      "Documentation & handoff",
    ],
  },
];

export const INCLUDED = [
  "Discovery",
  "UI/UX design",
  "Frontend",
  "Backend",
  "Auth & security",
  "Testing",
  "Deployment",
  "Documentation",
  "Post-launch support",
];
