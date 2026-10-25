export const GITHUB_URL = "https://github.com/michael2004-svg";

export const stats = [
  { label: "Products live", value: "8" },
  { label: "GitHub contributions / yr", value: "516" },
  { label: "M-Pesa orders processed", value: "389" },
  { label: "Features on NearbyRadar", value: "70+" },
];

export type Proof = {
  id: string;
  title: string;
  detail: string;
};

// No client testimonials published yet — these are checkable facts instead.
export const proofs: Proof[] = [
  {
    id: "nearbyradar",
    title: "NearbyRadar",
    detail: "70+ features shipped for discovering nearby shops, schools and services across Kenya.",
  },
  {
    id: "bookverse",
    title: "Bookverse",
    detail: "Full edtech platform with over 200 titles, built and maintained end-to-end.",
  },
  {
    id: "vms",
    title: "Visitor Management System",
    detail: "Delivered for Kenya Literature Bureau — digital check-in and reporting still running in production.",
  },
];
