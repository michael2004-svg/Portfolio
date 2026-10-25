export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  role: string;
  year: string;
  status: "Live" | "Spec" | "Discontinued";
  image?: string;
  gradient: string;
  metrics: { label: string; value: string }[];
  caseStudy: { overview: string; architecture: string; challenge: string };
};

export const projects: Project[] = [
  {
    id: "nearbyradar",
    title: "NearbyRadar",
    tagline: "Find what's around you, across Kenya",
    description:
      "A discovery platform for nearby shops, schools and services across Kenya — 70+ features shipped and running in production.",
    tech: ["React Native", "Expo", "Geolocation", "Admin Dashboard"],
    role: "Full-stack / Product",
    year: "2025",
    status: "Live",
    image: "/images/projects/nearbyradar.png",
    gradient: "from-violet-500 to-blue-500",
    metrics: [{ label: "Features shipped", value: "70+" }, { label: "Coverage", value: "Kenya" }],
    caseStudy: {
      overview: "NearbyRadar makes local businesses and services discoverable to the people closest to them.",
      architecture: "Location-aware mobile client backed by a listings API and an admin surface for managing businesses and categories.",
      challenge: "Keeping 70+ features coherent and fast as the product grew, without the app feeling cluttered.",
    },
  },
  {
    id: "vms",
    title: "Visitor Management System",
    tagline: "Built for Kenya Literature Bureau",
    description:
      "Digital visitor check-in and reporting delivered for Kenya Literature Bureau — replacing paper logs and still running in production.",
    tech: ["Web Application", "Reporting", "Access Control"],
    role: "Full-stack",
    year: "2025",
    status: "Live",
    image: "/images/projects/vms.png",
    gradient: "from-violet-700 to-violet-500",
    metrics: [{ label: "Client", value: "KLB" }, { label: "Status", value: "In production" }],
    caseStudy: {
      overview: "VMS gives Kenya Literature Bureau a reliable digital record of who enters their premises and when.",
      architecture: "Web-based check-in flow for front-desk staff, with role-based access and exportable reports for administrators.",
      challenge: "Making check-in quick enough for a busy front desk while keeping records complete and auditable.",
    },
  },
  {
    id: "skillence",
    title: "Skillence / Creator OS",
    tagline: "An operating system for solo founders",
    description:
      "Web + app command center for creators and solo founders — content planning, asset management, productivity and publishing workflows that work identically on mobile and desktop.",
    tech: ["React Native", "Expo", "Electron", "TypeScript"],
    role: "Full-stack / Product",
    year: "2025",
    status: "Live",
    image: "/images/projects/creatoros.png",
    gradient: "from-violet-500 to-magenta-500",
    metrics: [{ label: "Platforms", value: "3" }, { label: "Codebase", value: "Shared" }],
    caseStudy: {
      overview: "Creator OS unifies the fragmented toolchain creators juggle into a single cross-platform surface.",
      architecture: "One React Native/Expo codebase ships to mobile, wrapped in Electron for desktop, sharing business logic across both.",
      challenge: "Keeping a single UI language feeling native on both a phone screen and a desktop window.",
    },
  },
  {
    id: "bookverse",
    title: "Bookverse",
    tagline: "Kenya's digital bookstore",
    description:
      "A mobile-first digital bookstore built for the Kenyan market with over 200 titles to read, plus a full admin dashboard for catalog, orders, and payments.",
    tech: ["React Native", "Expo", "Admin Dashboard"],
    role: "Full-stack",
    year: "2025",
    status: "Live",
    image: "/images/projects/bookverse.png",
    gradient: "from-violet-500 to-blue-500",
    metrics: [{ label: "Titles", value: "200+" }, { label: "Market", value: "Kenya" }],
    caseStudy: {
      overview: "Bookverse brings digital book buying to a market underserved by existing platforms.",
      architecture: "Expo-managed React Native client backed by an admin dashboard for inventory, orders, and reporting.",
      challenge: "Designing checkout flows that assume patchy connectivity and mobile-money-first habits.",
    },
  },
  {
    id: "cardy-cash",
    title: "Cardy Cash",
    tagline: "Pick a card, take a chance",
    description:
      "A probabilistic card-pick game where players choose cards for a chance to win — Next.js/Supabase web app with a full admin dashboard, deployed on Vercel.",
    tech: ["Next.js", "Supabase", "Vercel", "M-Pesa"],
    role: "Full-stack",
    year: "2025",
    status: "Live",
    image: "/images/projects/cardycash.jpeg",
    gradient: "from-magenta-500 to-violet-700",
    metrics: [{ label: "Stack", value: "Next.js + Supabase" }, { label: "Deploy", value: "Vercel" }],
    caseStudy: {
      overview: "Cardy Cash pairs a fast consumer game with an operator dashboard for real-time visibility.",
      architecture: "Next.js App Router frontend, Supabase for auth/data/realtime, deployed serverless on Vercel.",
      challenge: "Balancing a playful user experience with an admin surface that needed to feel serious and auditable.",
    },
  },
  {
    id: "eleven",
    title: "ELEVEN",
    tagline: "A voice assistant that fits in your pocket",
    description: "A mobile AI assistant app with a holographic, voice-first interface, built with React Native and Expo.",
    tech: ["React Native", "Expo", "Voice UI", "AI"],
    role: "Full-stack",
    year: "2025",
    status: "Live",
    image: "/images/projects/eleven.png",
    gradient: "from-violet-300 to-violet-700",
    metrics: [{ label: "Interface", value: "Voice-first" }, { label: "Platform", value: "iOS / Android" }],
    caseStudy: {
      overview: "ELEVEN explores what a personal AI assistant feels like when it's built mobile-first.",
      architecture: "React Native/Expo client handling voice capture and UI state, with assistant logic layered on top.",
      challenge: "Making a voice-first interface still feel complete when a user's hands are free but they'd rather not talk.",
    },
  },
  {
    id: "be-trades",
    title: "Flow Binary",
    tagline: "Binary options, real-time",
    description: "A binary options trading platform powered by the Deriv API, with live WebSocket price streaming.",
    tech: ["WebSockets", "Deriv API", "Real-time Trading"],
    role: "Full-stack",
    year: "2025",
    status: "Live",
    image: "/images/projects/flowbinary.png",
    gradient: "from-violet-700 to-magenta-500",
    metrics: [{ label: "Data", value: "Live WebSocket" }, { label: "Integration", value: "Deriv API" }],
    caseStudy: {
      overview: "Flow Binary connects directly to Deriv's WebSocket feed so on-screen prices match the market in real time.",
      architecture: "Persistent WebSocket connection streaming live price data into a trading UI.",
      challenge: "Keeping the UI responsive and accurate under a constant stream of price updates.",
    },
  },
  {
    id: "systemx",
    title: "SystemX",
    tagline: "Ready-built systems, leased and customised",
    description: "A marketplace listing ready-built software systems that businesses can lease and customise instead of building from scratch.",
    tech: ["Marketplace", "Web Application", "Payments"],
    role: "Full-stack / Product",
    year: "2025",
    status: "Live",
    image: "/images/projects/systemx.jpeg",
    gradient: "from-magenta-500 to-violet-500",
    metrics: [{ label: "Model", value: "Lease + customise" }, { label: "Type", value: "Marketplace" }],
    caseStudy: {
      overview: "SystemX shortens time-to-launch by letting businesses start from a working system rather than a blank page.",
      architecture: "Catalog of deployable systems with listing, enquiry and customisation flows on top of a shared web platform.",
      challenge: "Presenting complex software products so a non-technical buyer can tell quickly whether one fits.",
    },
  },
  {
    id: "nairobi-king",
    title: "Nairobi King",
    tagline: "An online betting game, designed from the ground up",
    description: "Full game design and technical specification for an online betting game.",
    tech: ["Game Design", "Technical Spec", "Systems Design"],
    role: "Design + Engineering Spec",
    year: "2025",
    status: "Spec",
    gradient: "from-magenta-500 to-violet-500",
    metrics: [{ label: "Scope", value: "Design → Spec" }, { label: "Domain", value: "Real-money gaming" }],
    caseStudy: {
      overview: "Nairobi King started as a game concept and was taken all the way to an implementation-ready spec.",
      architecture: "Documented system architecture covering game logic and odds/payout mechanics.",
      challenge: "Getting the mechanics fair and the odds mathematically sound before any production code.",
    },
  },
];
