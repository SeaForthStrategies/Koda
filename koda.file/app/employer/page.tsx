"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Users, Clock, FileText, ChevronDown, RefreshCw } from "lucide-react";
import { getSession, clearSession } from "@/lib/auth";
import { getStoredSubmissions } from "@/lib/submissions";
import { KodaLogo } from "@/components/KodaLogo";
import { formatDecimalHours, formatMinutes } from "@/lib/utils";
import type { StoredSubmission } from "@/types";

export default function EmployerPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    if (s.role !== "employer") {
      router.replace("/dashboard");
      return;
    }
    setSession(s);
  }, [router]);

  const loadSubmissions = useCallback(() => {
    setSubmissions(getStoredSubmissions());
  }, []);

  useEffect(() => {
    if (session?.role === "employer") loadSubmissions();
  }, [session, loadSubmissions]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-koda-bg">
        <span className="w-8 h-8 border-2 border-koda-accent/30 border-t-koda-accent rounded-full animate-spin" />
      </div>
    );
  }

  const totalHours = submissions.reduce((sum, s) => sum + s.weeklyTotal, 0);
  const uniqueEmployees = new Set(submissions.map((s) => s.submitterEmail)).size;

  return (
    <div className="min-h-screen bg-koda-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <KodaLogo size="md" />
            <div className="h-6 w-px bg-koda-border" />
            <h1 className="text-lg font-semibold text-koda-text">Employer backend</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-koda-text-muted">{session.name}</span>
            <button
              type="button"
              onClick={loadSubmissions}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-koda-text-muted hover:bg-slate-100 border border-koda-border transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
              title="Refresh submissions"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-koda-red hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </header>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-koda-border shadow-sm p-5">
            <div className="flex items-center gap-2 text-koda-text-muted mb-1">
              <FileText size={16} />
              <span className="text-sm font-medium">Submissions</span>
            </div>
            <p className="text-2xl font-semibold text-koda-text">{submissions.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-koda-border shadow-sm p-5">
            <div className="flex items-center gap-2 text-koda-text-muted mb-1">
              <Users size={16} />
              <span className="text-sm font-medium">Employees</span>
            </div>
            <p className="text-2xl font-semibold text-koda-text">{uniqueEmployees}</p>
          </div>
          <div className="bg-white rounded-2xl border border-koda-border shadow-sm p-5">
            <div className="flex items-center gap-2 text-koda-text-muted mb-1">
              <Clock size={16} />
              <span className="text-sm font-medium">Total hours</span>
            </div>
            <p className="text-2xl font-semibold text-koda-green">
              {formatDecimalHours(totalHours)}
            </p>
            <p className="text-xs text-koda-text-muted mt-0.5">{formatMinutes(totalHours)}</p>
          </div>
        </div>

        {/* Submissions table */}
        <div className="bg-white rounded-2xl border border-koda-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-koda-border">
            <h2 className="text-sm font-semibold text-koda-text">All timecards</h2>
            <p className="text-xs text-koda-text-muted mt-0.5">
              Submitted timecards (stored in this browser).
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="px-5 py-12 text-center text-koda-text-muted text-sm">
              No submissions yet. Have employees sign in and submit timecards from the employee portal.
            </div>
          ) : (
            <div className="divide-y divide-koda-border">
              {submissions.map((sub) => {
                const isExpanded = expandedId === sub.id;
                return (
                  <div key={sub.id} className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between text-left py-1 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div>
                          <p className="font-medium text-koda-text truncate">{sub.submitterName}</p>
                          <p className="text-xs text-koda-text-muted font-mono truncate">
                            {sub.submitterEmail}
                          </p>
                        </div>
                        <span className="text-sm text-koda-text-muted shrink-0">{sub.weekLabel}</span>
                        <span className="font-mono font-semibold text-koda-green shrink-0">
                          {formatDecimalHours(sub.weeklyTotal)}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-koda-muted shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-koda-border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs font-medium text-koda-text-muted uppercase tracking-wider">
                              <th className="text-left py-2">Day</th>
                              <th className="text-left py-2">Date</th>
                              <th className="text-left py-2">In</th>
                              <th className="text-left py-2">Out</th>
                              <th className="text-left py-2">Description</th>
                              <th className="text-right py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sub.entries
                              .filter((e) => e.enabled && e.dailyTotal > 0)
                              .map((e) => (
                                <tr key={e.id} className="border-t border-slate-100">
                                  <td className="py-2 font-medium text-koda-text">{e.day}</td>
                                  <td className="py-2 text-koda-text-muted">{e.date}</td>
                                  <td className="py-2 font-mono text-koda-text-muted">{e.clockIn}</td>
                                  <td className="py-2 font-mono text-koda-text-muted">{e.clockOut}</td>
                                  <td className="py-2 text-koda-text-muted max-w-[200px] truncate">
                                    {e.description || "—"}
                                  </td>
                                  <td className="py-2 text-right font-mono font-medium text-koda-green">
                                    {formatMinutes(e.dailyTotal)}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        <p className="text-xs text-koda-text-muted mt-3">
                          Submitted {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-koda-muted mt-8">Koda Employer Backend</p>
      </div>
    </div>
  );
}
