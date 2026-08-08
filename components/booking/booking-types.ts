export type ProjectType =
  | "landing"
  | "business"
  | "webapp"
  | "mobile"
  | "saas"
  | "enterprise";

export type BudgetRange = "under-500" | "500-2000" | "2000-6000" | "6000-plus" | "not-sure";
export type Deadline = "asap" | "1-month" | "1-3-months" | "flexible";

export type BookingData = {
  tierPreselect: string | null;
  projectType: ProjectType | null;
  budget: BudgetRange | null;
  deadline: Deadline | null;
  features: string[];
  inspiration: string;
  fileNames: string[];
};

export const initialBookingData: BookingData = {
  tierPreselect: null,
  projectType: null,
  budget: null,
  deadline: null,
  features: [],
  inspiration: "",
  fileNames: [],
};

export const PROJECT_TYPES: { id: ProjectType; label: string; weight: number }[] = [
  { id: "landing", label: "Landing Page", weight: 1 },
  { id: "business", label: "Business Website", weight: 2 },
  { id: "webapp", label: "Web Application", weight: 4 },
  { id: "mobile", label: "Mobile App", weight: 5 },
  { id: "saas", label: "SaaS Platform", weight: 7 },
  { id: "enterprise", label: "Enterprise System", weight: 9 },
];

export const FEATURE_OPTIONS = [
  "User authentication",
  "Payments (M-Pesa/Stripe/PayPal)",
  "Admin dashboard",
  "Real-time data",
  "Third-party API integrations",
  "Multi-language support",
  "Push notifications",
  "Analytics & reporting",
];
