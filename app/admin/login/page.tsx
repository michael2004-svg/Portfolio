import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { adminLogin } from "../actions";

export const metadata: Metadata = { title: "Admin — Sign in", robots: { index: false } };

export default function AdminLogin() {
  return <LoginForm action={adminLogin} title="Admin" subtitle="Analytics, leads, clients and reviews." />;
}
