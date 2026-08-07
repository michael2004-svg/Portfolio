export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  role: string;
  year: string;
  thumbnail: string; // placeholder path — swap with real screenshot
  gradient: string; // accent gradient per project
  metrics: { label: string; value: string }[];
  caseStudy: {
    overview: string;
    architecture: string;
    challenge: string;
  };
};

export const projects: Project[] = [
  {
    id: "skillence",
    title: "Skillence / Creator OS",
    tagline: "A creator's entire toolkit, in one app",
    description:
      "Cross-platform command center for content creators — content planning, asset management, and publishing tools that work identically on mobile and desktop.",
    tech: ["React Native", "Expo", "Electron", "TypeScript"],
    role: "Full-stack / Product",
    year: "2025",
    thumbnail: "/projects/skillence.png",
    gradient: "from-violet-500 to-magenta-500",
    metrics: [
      { label: "Platforms", value: "3" },
      { label: "Codebase", value: "Shared" },
    ],
    caseStudy: {
      overview:
        "Creator OS unifies the fragmented toolchain creators juggle — scripts, assets, schedules — into a single cross-platform surface.",
      architecture:
        "One React Native/Expo codebase ships to mobile, wrapped in Electron for desktop, sharing business logic across both.",
      challenge:
        "Keeping a single UI language feeling native on both a phone screen and a desktop window without maintaining two design systems.",
    },
  },
  {
    id: "bookverse",
    title: "Bookverse",
    tagline: "Kenya's digital bookstore",
    description:
      "A mobile-first digital bookstore built for the Kenyan market, with a full admin dashboard for catalog, orders, and payments.",
    tech: ["React Native", "Expo", "Admin Dashboard"],
    role: "Full-stack",
    year: "2025",
    thumbnail: "/projects/bookverse.png",
    gradient: "from-violet-500 to-blue-500",
    metrics: [
      { label: "Market", value: "Kenya" },
      { label: "Admin tools", value: "Full suite" },
    ],
    caseStudy: {
      overview:
        "Bookverse brings digital book buying to a market underserved by existing platforms, with local payment rails baked in from day one.",
      architecture:
        "Expo-managed React Native client backed by an admin dashboard for inventory, order fulfillment, and sales reporting.",
      challenge:
        "Designing checkout flows that assume patchy connectivity and mobile-money-first payment habits, not card-first defaults.",
    },
  },
  {
    id: "cardy-cash",
    title: "Cardy Cash",
    tagline: "Rewards, gamified",
    description:
      "A Next.js/Supabase web app with a full admin dashboard, deployed on Vercel — built for speed and clarity on both the user and operator side.",
    tech: ["Next.js", "Supabase", "Vercel"],
    role: "Full-stack",
    year: "2025",
    thumbnail: "/projects/cardy-cash.png",
    gradient: "from-magenta-500 to-violet-700",
    metrics: [
      { label: "Stack", value: "Next.js + Supabase" },
      { label: "Deploy", value: "Vercel" },
    ],
    caseStudy: {
      overview:
        "Cardy Cash pairs a fast consumer-facing app with an operator dashboard that gives the business real-time visibility into activity.",
      architecture:
        "Next.js App Router frontend, Supabase for auth/data/realtime, deployed serverless on Vercel for near-zero cold starts.",
      challenge:
        "Balancing a playful, gamified user experience with an admin surface that needed to feel serious and auditable.",
    },
  },
  {
    id: "eleven",
    title: "ELEVEN",
    tagline: "A voice assistant that fits in your pocket",
    description:
      "A mobile voice assistant app built with React Native and Expo — natural interaction design wrapped around real assistant logic.",
    tech: ["React Native", "Expo", "Voice UI"],
    role: "Full-stack",
    year: "2025",
    thumbnail: "/projects/eleven.png",
    gradient: "from-violet-300 to-violet-700",
    metrics: [
      { label: "Interface", value: "Voice-first" },
      { label: "Platform", value: "iOS / Android" },
    ],
    caseStudy: {
      overview:
        "ELEVEN explores what a personal voice assistant feels like when it's built mobile-first instead of retrofitted from a smart speaker.",
      architecture:
        "React Native/Expo client handling voice capture and UI state, with assistant logic layered on top.",
      challenge:
        "Making a voice-first interface still feel complete and navigable when a user's hands are free but they'd rather not talk.",
    },
  },
  {
    id: "nairobi-king",
    title: "Nairobi King",
    tagline: "An online betting game, designed from the ground up",
    description:
      "Full game design and technical specification for an online betting game — from mechanics and odds logic to the engineering architecture behind it.",
    tech: ["Game Design", "Technical Spec", "Systems Design"],
    role: "Design + Engineering Spec",
    year: "2025",
    thumbnail: "/projects/nairobi-king.png",
    gradient: "from-magenta-500 to-violet-500",
    metrics: [
      { label: "Scope", value: "Design → Spec" },
      { label: "Domain", value: "Real-money gaming" },
    ],
    caseStudy: {
      overview:
        "Nairobi King started as a game concept and was taken all the way to an implementation-ready technical specification.",
      architecture:
        "Documented system architecture covering game logic, odds/payout mechanics, and the engineering approach to build it.",
      challenge:
        "Getting the mechanics fair and the odds mathematically sound before a single line of production code gets written.",
    },
  },
  {
    id: "be-trades",
    title: "BE-Trades",
    tagline: "Binary options, real-time",
    description:
      "A binary options trading app with live Deriv WebSocket integration — real-time price feeds driving real-time trade decisions.",
    tech: ["WebSockets", "Deriv API", "Real-time Trading"],
    role: "Full-stack",
    year: "2025",
    thumbnail: "/projects/be-trades.png",
    gradient: "from-violet-700 to-magenta-500",
    metrics: [
      { label: "Data", value: "Live WebSocket" },
      { label: "Integration", value: "Deriv API" },
    ],
    caseStudy: {
      overview:
        "BE-Trades connects directly to Deriv's WebSocket feed so price movement on screen matches the market in real time, not on a polling delay.",
      architecture:
        "Persistent WebSocket connection streaming live price data into a trading UI built for fast decision-making.",
      challenge:
        "Keeping the UI responsive and accurate under a constant stream of price updates without janking the interface.",
    },
  },
];
