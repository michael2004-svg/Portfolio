export const BUILD_TYPES = ["Website", "Mobile App", "Web Application", "Custom Software", "SaaS", "E-commerce", "API / Integration", "Not Sure Yet"];
export const QUICK_START = ["Website", "Mobile App", "Web Application", "Custom Software", "Not Sure Yet"];
export const STAGES = ["Just an idea", "Have a design", "Already in development", "Replacing an existing system"];
export const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "6+ months", "Not sure"];
export const BUDGETS = ["Under KES 150,000", "KES 150,000 – 400,000", "KES 400,000 – 1,000,000", "Above KES 1,000,000", "I'm not sure yet"];

export const DELIVERY_FLOW = ["Business Problem", "Product Strategy", "UX / UI", "Architecture", "Development", "Testing", "Deployment", "Support"];

export const LIVE_PROJECTS = [
  { name: "Cardy Cash", img: "/images/projects/cardycash.jpeg", desc: "Probabilistic card-pick game where players choose cards for a chance to win.", live: true },
  { name: "Flow Binary", img: "/images/projects/flowbinary.png", desc: "Binary options trading platform powered by the Deriv API.", live: true },
  { name: "Visitor Management System (VMS)", img: "/images/projects/vms.png", desc: "Built for Kenya Literature Bureau — digital visitor check-in and reporting.", live: true },
  { name: "Creator OS", img: "/images/projects/creatoros.png", desc: "Web + app operating system for solo founders' productivity and workflows.", live: true },
  { name: "NearbyRadar", img: "/images/projects/nearbyradar.png", desc: "Discover nearby shops, schools and services — 70+ features shipped.", live: true },
  { name: "King Insano Beats", img: "/images/landing/kinginsano.jpeg", desc: "Marketplace for selling beats and connecting with musicians.", live: false },
  { name: "Bookverse", img: "/images/projects/bookverse.png", desc: "Online book app with over 200 PDF titles available to read.", live: true },
  { name: "SystemX", img: "/images/projects/systemx.jpeg", desc: "Marketplace listing ready-built systems for lease and customization.", live: true },
  { name: "Eleven AI", img: "/images/projects/eleven.png", desc: "Mobile AI assistant app with a holographic, voice-first interface.", live: true },
];

export const RESULTS = [
  { img: "/images/landing/20.png", alt: "Account balance across real accounts", label: "Account Balance", value: "$20,273.45", note: "≈ KES 2,622,000 (at ~129.35 KES/USD, fluctuates)", tone: "lime" },
  { img: "/images/landing/46mrr.png", alt: "Monthly recurring revenue screenshot", label: "Monthly Recurring Revenue", value: "KES 46,706", note: "MRR", tone: "blue" },
  { img: "/images/landing/50mrr.png", alt: "M-Pesa revenue dashboard screenshot", label: "M-Pesa Revenue", value: "KES 51,921", note: "389 orders", tone: "blue" },
];

export const TICKER_SERVICES = ["WEB DEVELOPMENT", "MOBILE APPS", "WEB APPLICATIONS", "CUSTOM SOFTWARE", "SAAS", "E-COMMERCE", "BUSINESS AUTOMATION", "API INTEGRATION"];
export const TICKER_TECH = ["REACT", "NEXT.JS", "NODE.JS", "NESTJS", "REACT NATIVE", "EXPO", "POSTGRESQL", "MYSQL", "MONGODB", "SUPABASE", "DOCKER", "CLOUDFLARE", "AWS"];

export const CAPABILITIES = [
  { title: "Websites", img: "/images/landing/websitespreview.jpeg", desc: "Corporate websites, marketing sites, portals, content platforms.", type: "Website" },
  { title: "Mobile Apps", img: "/images/landing/mobileappspreview.jpeg", desc: "Android, iOS, cross-platform, customer-facing applications.", type: "Mobile App" },
  { title: "Web Applications", img: "/images/landing/webapplicationpreview.jpeg", desc: "Dashboards, platforms, management systems, SaaS products.", type: "Web Application" },
  { title: "Custom Business Software", img: "/images/landing/custombusinesssoftwarepreview.jpeg", desc: "ERP, CRM, HR systems, inventory, operations, workflow automation.", type: "Custom Software" },
  { title: "E-Commerce", img: "/images/landing/ecommercepreview.jpeg", desc: "Online stores, marketplaces, payments, inventory, order flows.", type: "E-commerce" },
  { title: "API & Integrations", img: "/images/landing/apiandintergationpreview.jpeg", desc: "Payment gateways, third-party APIs, webhooks, authentication.", type: "API / Integration" },
];

export const GOOD_FIT = [
  "You have a real business problem or opportunity software needs to solve — even if it's not fully specced yet.",
  "You want one team accountable for the whole build, not a patchwork of freelancers.",
  "You need it live and in front of real users or customers, not a portfolio piece.",
  "You're ready to move once scope and price are locked in.",
];
export const NOT_FIT = [
  "You want the cheapest possible build regardless of quality or maintainability.",
  "You're not able to make product decisions or provide feedback during the build.",
  "You need a rough prototype only, with no intention of launching it.",
  "You're looking for hourly staff-augmentation rather than a scoped, delivered product.",
];

export const OFFER = [
  { title: "Discovery & Requirements", desc: "Understanding your business, users and goals before any technical decisions.", value: "40,000" },
  { title: "Product / Technical Planning", desc: "Mapping requirements to a real architecture and technology choice.", value: "35,000" },
  { title: "UI/UX Design", desc: "Interfaces designed around how your users actually work.", value: "60,000" },
  { title: "Frontend Development", desc: "The interface your users and customers interact with directly.", value: "150,000" },
  { title: "Backend Development", desc: "The logic, business rules and services running behind the product.", value: "150,000" },
  { title: "Database & API Architecture", desc: "Data structured to scale and APIs built to connect cleanly.", value: "50,000" },
  { title: "Authentication & Security", desc: "Access control and data protection built in, not bolted on.", value: "40,000" },
  { title: "Testing & Quality Assurance", desc: "Verifying the product works the way it's supposed to before launch.", value: "35,000" },
  { title: "Deployment", desc: "Getting the product live, monitored and reachable by real users.", value: "25,000" },
  { title: "Documentation", desc: "A clear record of how the system works and how to maintain it.", value: "20,000" },
  { title: "Post-Launch Support", desc: "A support window included so launch day isn't the last day we talk.", value: "45,000" },
];

export const PROCESS = [
  { title: "Discover", desc: "Understand the goal" },
  { title: "Define", desc: "Lock scope & requirements" },
  { title: "Design", desc: "Map the user experience" },
  { title: "Build", desc: "Develop in sprints" },
  { title: "Test", desc: "Verify it actually works" },
  { title: "Launch", desc: "Ship to production" },
  { title: "Support", desc: "Stay live and maintained" },
];

export const NO_RISK_STEPS = [
  "Tell us what you're trying to build.",
  "We review the project before the call.",
  "We discuss your goals, users, features and requirements.",
  "We identify the right technical approach.",
  "You receive clear next steps.",
  "If we're a good fit, we prepare a proposal and development plan.",
];

export const PROOF_OF_WORK = [
  { title: "NearbyRadar", desc: "70+ features shipped for discovering nearby shops, schools and services across Kenya." },
  { title: "Bookverse", desc: "Full edtech platform with over 200 titles, built and maintained end-to-end." },
  { title: "Visitor Management System (VMS)", desc: "Delivered for Kenya Literature Bureau — digital check-in and reporting still running in production." },
];

export const SITUATIONS = [
  { q: "I only have an idea.", a: "That's exactly what the free consultation is for — we help shape it into a real, scoped plan." },
  { q: "We already started development.", a: "We review what exists, assess the codebase, and pick up from where it makes sense — not from zero." },
  { q: "We have a design but no developers.", a: "We build directly from your existing designs and fill the development gap." },
  { q: "We need to replace an old system.", a: "We plan a migration path so the replacement doesn't disrupt what's already running." },
  { q: "We don't know which technology to use.", a: "That's our call to make — recommendations come out of the scoping conversation, not a sales pitch." },
  { q: "We need integrations.", a: "Payment gateways, third-party APIs, and webhooks are a routine part of most builds." },
  { q: "We need mobile and web.", a: "Both are handled as one connected product, not two separate projects." },
  { q: "We need ongoing support.", a: "A support window is included in delivery, and ongoing arrangements can be scoped separately." },
];

export const PRICES = [
  { name: "Websites", price: "KES 80,000" },
  { name: "Mobile Apps", price: "KES 250,000" },
  { name: "Web Apps", price: "KES 200,000" },
  { name: "Custom Software", price: "KES 300,000" },
];

export const GUARANTEES = [
  { title: "Clear Proposal, Or It's On Us", desc: "If we can't hand you a clear, fixed-price proposal within 5 business days of your consultation, we won't ask you to pay anything to that point — no deposit, no fee." },
  { title: "You Own What You Pay For", desc: "Full source code ownership transfers to you the moment final payment clears — always, no exceptions, no hostage clauses." },
];

export const FAQ = [
  { q: "How much does software development cost?", a: "It depends entirely on scope. We confirm a fixed price after the free consultation, once requirements are clear." },
  { q: "How long does a project take?", a: "Simple projects can take a few weeks; larger platforms take longer. You get a real timeline in the proposal." },
  { q: "Can you build from an idea?", a: "Yes — the consultation exists specifically to turn an idea into a scoped, buildable plan." },
  { q: "Can you work with an existing design?", a: "Yes, we build directly from designs you already have." },
  { q: "Can you take over an existing project?", a: "Yes, we review the current codebase and continue from there." },
  { q: "Do you build both frontend and backend?", a: "Yes, full-stack delivery is standard." },
  { q: "Can you integrate M-Pesa?", a: "Yes, Daraja API and STK Push integrations are a common part of our builds." },
  { q: "Can you integrate Stripe?", a: "Yes, Stripe and other payment providers can be integrated as needed." },
  { q: "Can you integrate other APIs?", a: "Yes, third-party API and webhook integrations are routine." },
  { q: "Do you provide hosting?", a: "Yes, deployment and hosting setup are part of delivery." },
  { q: "Do you provide maintenance?", a: "Yes, a support window is included, with ongoing arrangements available after." },
  { q: "Who owns the source code?", a: "You do, once the project is delivered and paid for in full." },
  { q: "Can you sign an NDA?", a: "Yes, this can be arranged before any detailed discussion." },
  { q: "Can we work remotely?", a: "Yes, all consultations and project work are handled remotely." },
  { q: "What happens after the consultation?", a: "If it's a good fit, you receive a written proposal with scope, timeline and price." },
  { q: "Can I track my project while it's being built?", a: "Yes — every client gets a private portal with live progress, milestone approvals, updates, and all contracts and deliverables in one place." },
];
