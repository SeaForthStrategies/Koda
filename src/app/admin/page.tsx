import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { AdminHeader } from "@/components/dashboard/AdminHeader";
import { WorkspaceJoinCode } from "@/components/dashboard/WorkspaceJoinCode";

export const metadata = {
  title: "Admin – Koda",
  description: "Employer timecards view",
};

export default function AdminPage() {
  return (
    <div className="min-h-[100dvh] bg-background pb-safe">
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 pb-10 sm:px-6 sm:py-8 md:py-10">
        <WorkspaceJoinCode />
        <AdminDashboard />
      </main>
    </div>
  );
}
