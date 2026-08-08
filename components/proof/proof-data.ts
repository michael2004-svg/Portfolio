export type ProofItem = {
  id: string;
  kind: "metric" | "screenshot";
  label: string;
  value?: string; // for metric cards
  numericValue?: number; // for count-up
  prefix?: string;
  suffix?: string;
  source?: string; // e.g. "M-Pesa", "Stripe", "PayPal"
  position: { top: string; left: string }; // % based scatter position
  size: "sm" | "md" | "lg";
  gradient: string;
};

export const proofItems: ProofItem[] = [
  {
    id: "mpesa-confirm",
    kind: "screenshot",
    label: "M-Pesa payment confirmation",
    source: "M-Pesa",
    position: { top: "8%", left: "6%" },
    size: "sm",
    gradient: "from-green-500/30 to-violet-500/20",
  },
  {
    id: "revenue-metric",
    kind: "metric",
    label: "Client revenue processed",
    numericValue: 4200000,
    prefix: "KES ",
    suffix: "+",
    position: { top: "4%", left: "34%" },
    size: "lg",
    gradient: "from-violet-500/30 to-magenta-500/20",
  },
  {
    id: "stripe-dash",
    kind: "screenshot",
    label: "Stripe dashboard — live sales",
    source: "Stripe",
    position: { top: "10%", left: "62%" },
    size: "md",
    gradient: "from-violet-500/30 to-blue-500/20",
  },
  {
    id: "uptime-metric",
    kind: "metric",
    label: "Average uptime",
    numericValue: 99.9,
    suffix: "%",
    position: { top: "34%", left: "4%" },
    size: "md",
    gradient: "from-violet-300/30 to-violet-700/20",
  },
  {
    id: "client-chat",
    kind: "screenshot",
    label: "Client handoff conversation",
    source: "WhatsApp",
    position: { top: "40%", left: "28%" },
    size: "sm",
    gradient: "from-emerald-500/25 to-violet-500/20",
  },
  {
    id: "paypal-payout",
    kind: "screenshot",
    label: "PayPal payout receipt",
    source: "PayPal",
    position: { top: "30%", left: "56%" },
    size: "sm",
    gradient: "from-blue-500/25 to-violet-500/20",
  },
  {
    id: "projects-metric",
    kind: "metric",
    label: "Products shipped",
    numericValue: 12,
    suffix: "+",
    position: { top: "36%", left: "80%" },
    size: "md",
    gradient: "from-magenta-500/30 to-violet-500/20",
  },
  {
    id: "analytics-graph",
    kind: "screenshot",
    label: "Analytics — traffic growth",
    source: "Analytics",
    position: { top: "62%", left: "10%" },
    size: "md",
    gradient: "from-violet-500/30 to-magenta-500/20",
  },
  {
    id: "bank-transfer",
    kind: "screenshot",
    label: "Bank transfer confirmation",
    source: "Bank",
    position: { top: "68%", left: "40%" },
    size: "sm",
    gradient: "from-violet-300/25 to-violet-700/20",
  },
  {
    id: "response-metric",
    kind: "metric",
    label: "Avg. response time",
    numericValue: 2,
    suffix: "h",
    position: { top: "60%", left: "66%" },
    size: "sm",
    gradient: "from-violet-500/30 to-blue-500/20",
  },
  {
    id: "invoice",
    kind: "screenshot",
    label: "Invoice — project milestone",
    source: "Invoice",
    position: { top: "76%", left: "82%" },
    size: "sm",
    gradient: "from-magenta-500/25 to-violet-500/20",
  },
];

// pairs of ids to connect with glowing lines
export const connections: [string, string][] = [
  ["mpesa-confirm", "revenue-metric"],
  ["revenue-metric", "stripe-dash"],
  ["revenue-metric", "uptime-metric"],
  ["client-chat", "revenue-metric"],
  ["stripe-dash", "paypal-payout"],
  ["projects-metric", "stripe-dash"],
  ["analytics-graph", "client-chat"],
  ["bank-transfer", "analytics-graph"],
  ["response-metric", "projects-metric"],
  ["invoice", "response-metric"],
];
