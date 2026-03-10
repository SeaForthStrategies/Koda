import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { createClient } from "@/lib/supabase/server";
import EmployeeDashboardClient from "@/components/dashboard/EmployeeDashboardClient";

export const metadata = {
  title: "Employee dashboard – Koda",
  description: "View and submit your time entries.",
};

export default async function EmployeeDashboardPage() {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/employee/login");
  }

  console.time("employee-dashboard:session");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.timeEnd("employee-dashboard:session");

  if (!session || !session.user) {
    redirect("/employee/login");
  }

  console.time("employee-dashboard:queries");
  const [{ data: profile }, { data: timeEntries }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle(),
    supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false }),
  ]);
  console.timeEnd("employee-dashboard:queries");

  return (
    <div className="min-h-[100dvh] bg-background pb-safe">
      <DashboardHeader />
      <main className="mx-auto min-h-full max-w-3xl px-4 py-6 pb-10 sm:px-6 sm:py-8">
        <EmployeeDashboardClient
          user={session.user}
          profile={profile}
          initialEntries={timeEntries ?? []}
        />
      </main>
    </div>
  );
}

