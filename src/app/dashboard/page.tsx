import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard – Koda",
  description: "Submit your weekly time card",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/login");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profile?.role === "employee") {
    redirect("/employee-dashboard");
  }

  if (profile?.role === "employer") {
    redirect("/employer-dashboard");
  }

  redirect("/login");
}
