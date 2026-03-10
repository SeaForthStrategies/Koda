import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { createClient } from "@/lib/supabase/server";
import EmployerDashboardClient from "@/components/dashboard/EmployerDashboardClient";

export const metadata = {
  title: "Employer dashboard – Koda",
  description: "Review and approve company time entries.",
};

export default async function EmployerDashboardPage() {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/employer/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/employer/login");
  }

  console.time("employer-dashboard:profile");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  console.timeEnd("employer-dashboard:profile");

  if (!profile || (profile as { role?: string }).role !== "employer") {
    redirect("/dashboard");
  }

  console.time("employer-dashboard:company");
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();
  console.timeEnd("employer-dashboard:company");

  if (!company) {
    redirect("/dashboard");
  }

  const { data: timeEntries } = await supabase
    .from("time_entries")
    .select(
      `
      *,
      profiles(full_name, email)
    `
    )
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-[100dvh] bg-background pb-safe">
      <DashboardHeader />
      <main className="mx-auto min-h-full max-w-5xl px-4 py-6 pb-10 sm:px-6 sm:py-8">
        <EmployerDashboardClient
          teamCode={(company as { team_code?: string }).team_code}
          initialEntries={timeEntries ?? []}
        />
      </main>
    </div>
  );
}
