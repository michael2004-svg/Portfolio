import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { clientLogin } from "../actions";

export const metadata: Metadata = { title: "Client Portal — Sign in", robots: { index: false } };

export default function PortalLogin() {
  return <LoginForm action={clientLogin} title="Client Portal" subtitle="Track progress, approve milestones and download your documents." />;
}
