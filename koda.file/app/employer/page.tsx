"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Users, Clock, FileText, ChevronDown, RefreshCw, Settings } from "lucide-react";
import { getSession, clearSession } from "@/lib/auth";
import { getStoredSubmissions } from "@/lib/submissions";
import { KodaLogo } from "@/components/KodaLogo";
import { formatDecimalHours, formatMinutes, getRowTotalHours, getDayTotals } from "@/lib/utils";
import type { StoredSubmission, TaskRow } from "@/types";
import { DAY_KEYS } from "@/types";
import { getEmployerSettings, saveEmployerSettings, defaultEmployerSettings } from "@/lib/employer-settings";

const DAY_LABELS: Record<string, string> = { sat: "Sat", sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri" };

export default function EmployerPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [settings, setSettings] = useState(defaultEmployerSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState(defaultEmployerSettings);

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
    setSettings(getEmployerSettings());
    setSettingsForm(getEmployerSettings());
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

  const handleSaveSettings = () => {
    saveEmployerSettings(settingsForm);
    setSettings(getEmployerSettings());
    setSettingsOpen(false);
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
  const displayTitle = settings.timecardTitle.trim() || "Employee timecard";
  const displayCompany = settings.companyName.trim();

  return (
    <div className="min-h-screen bg-koda-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <KodaLogo size="md" />
            <div className="h-6 w-px bg-koda-border" />
            <div>
              <h1 className="text-lg font-semibold text-slate-900 text-koda-text">
                {displayCompany ? `${displayCompany} — Employer` : "Employer backend"}
              </h1>
              {displayCompany && (
                <p className="text-xs text-slate-600 text-koda-text-muted">{displayTitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 text-koda-text-muted">{session.name}</span>
            <button
              type="button"
              onClick={() => { setSettingsForm(getEmployerSettings()); setSettingsOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
              title="Customize company and timecard"
            >
              <Settings size={14} />
              Settings
            </button>
            <button
              type="button"
              onClick={loadSubmissions}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
              title="Refresh submissions"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </header>

        {/* Settings panel */}
        {settingsOpen && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Customize your timecard</h2>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="text-slate-500 hover:text-slate-700 text-sm"
              >
                Close
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Company name</label>
                <input
                  type="text"
                  value={settingsForm.companyName}
                  onChange={(e) => setSettingsForm((s) => ({ ...s, companyName: e.target.value }))}
                  placeholder="e.g. Fortier Inc."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Timecard title</label>
                <input
                  type="text"
                  value={settingsForm.timecardTitle}
                  onChange={(e) => setSettingsForm((s) => ({ ...s, timecardTitle: e.target.value }))}
                  placeholder="e.g. Fortier Employees Timecard Entry"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Default CC emails (comma-separated)</label>
                <input
                  type="text"
                  value={settingsForm.defaultCcEmails}
                  onChange={(e) => setSettingsForm((s) => ({ ...s, defaultCcEmails: e.target.value }))}
                  placeholder="payroll@company.com, manager@company.com"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Share with employees to pre-fill when they submit timecards.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Week ending label</label>
                <input
                  type="text"
                  value={settingsForm.weekEndingLabel}
                  onChange={(e) => setSettingsForm((s) => ({ ...s, weekEndingLabel: e.target.value }))}
                  placeholder="Week ending (Friday)"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent"
                />
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-koda-accent hover:bg-koda-accent/90 focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
                >
                  Save settings
                </button>
              </div>
            </div>
          </div>
        )}

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
            <h2 className="text-sm font-semibold text-slate-900 text-koda-text">
              {displayTitle}
            </h2>
            <p className="text-xs text-slate-600 text-koda-text-muted mt-0.5">
              {submissions.length > 0
                ? `${submissions.length} submission${submissions.length !== 1 ? "s" : ""} · Stored in this browser. Expand a row to see full grid and remarks.`
                : "Submissions are stored in this browser. Have employees sign in and submit from the employee portal."}
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
                        {sub.taskRows && sub.taskRows.length > 0 ? (
                          <>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm border-collapse">
                                <thead>
                                  <tr className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    {DAY_KEYS.map((k) => (
                                      <th key={k} className="text-center py-2 px-1">{DAY_LABELS[k]}</th>
                                    ))}
                                    <th className="text-center py-2 px-1">Total</th>
                                    <th className="text-left py-2 px-2">Charge / Task</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sub.taskRows.map((row) => {
                                    const rowTotal = getRowTotalHours(row);
                                    return (
                                      <tr key={row.id} className="border-t border-slate-100">
                                        {DAY_KEYS.map((k) => (
                                          <td key={k} className="py-1.5 px-1 text-center font-mono text-slate-700">
                                            {row[k]?.trim() || "—"}
                                          </td>
                                        ))}
                                        <td className="py-1.5 px-1 text-center font-mono font-medium text-koda-green">
                                          {rowTotal > 0 ? rowTotal.toFixed(1) : "—"}
                                        </td>
                                        <td className="py-1.5 px-2 text-slate-600 max-w-[200px] truncate">
                                          {row.description?.trim() || "—"}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  <tr className="border-t-2 border-slate-200 bg-slate-50/80 font-medium">
                                    <td className="py-2 px-1 text-center text-slate-600">T</td>
                                    {getDayTotals(sub.taskRows).map((n, i) => (
                                      <td key={i} className="py-2 px-1 text-center font-mono text-slate-800">
                                        {n > 0 ? n.toFixed(1) : "—"}
                                      </td>
                                    ))}
                                    <td className="py-2 px-1 text-center font-mono text-koda-green">
                                      {(sub.weeklyTotal / 60).toFixed(1)}
                                    </td>
                                    <td className="py-2 px-2" />
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            {sub.remarks?.trim() && (
                              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <p className="text-xs font-medium text-slate-500 mb-1">Remarks</p>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{sub.remarks}</p>
                              </div>
                            )}
                          </>
                        ) : (
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
                        )}
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
