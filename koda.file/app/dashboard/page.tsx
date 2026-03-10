"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { TaskRow } from "@/types";
import {
  buildTaskRows,
  getWeekEndingFriday,
  getWeekEndingFridayByOffset,
  getWeekEndingLabel,
  getGrandTotalHours,
  getRowTotalHours,
  formatDateForInput,
  parseDateFromInput,
} from "@/lib/utils";
import { getSession, clearSession } from "@/lib/auth";
import { saveSubmission } from "@/lib/submissions";
import { getPublicEmployerSettings } from "@/lib/employer-settings";
import { TimecardGrid } from "@/components/TimecardGrid";
import { SubmitFooter } from "@/components/SubmitFooter";
import { KodaLogo } from "@/components/KodaLogo";
import { ToastContainer } from "@/components/Toast";

interface ToastItem {
  id: string;
  type: "success" | "error";
  message: string;
}

type WeekOption = 0 | 1 | 2 | 3 | 4 | "custom";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [taskRows, setTaskRows] = useState<TaskRow[]>([]);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [weekOption, setWeekOption] = useState<WeekOption>(0);
  const [customWeekDate, setCustomWeekDate] = useState<string>(() =>
    formatDateForInput(getWeekEndingFriday())
  );
  const [employerBranding, setEmployerBranding] = useState({ companyName: "", timecardTitle: "" });

  const weekEnding = useMemo(() => {
    if (weekOption === "custom") {
      return getWeekEndingFriday(parseDateFromInput(customWeekDate));
    }
    return getWeekEndingFridayByOffset(-weekOption);
  }, [weekOption, customWeekDate]);

  const weekLabel = useMemo(() => getWeekEndingLabel(weekEnding), [weekEnding]);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    if (s.role === "employer") {
      router.replace("/employer");
      return;
    }
    setSession(s);
    setTaskRows(buildTaskRows(String(getWeekEndingFriday().getTime())));
    setEmployerBranding(getPublicEmployerSettings());
  }, [router]);

  const weeklyTotalHours = useMemo(() => getGrandTotalHours(taskRows), [taskRows]);

  const handleGridChange = useCallback((rowId: string, field: keyof TaskRow, value: string) => {
    setTaskRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r))
    );
  }, []);

  const addToast = useCallback((type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleReset = () => {
    setTaskRows(buildTaskRows(String(weekEnding.getTime())));
    setRemarks("");
    addToast("success", "Timecard reset.");
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const handleSubmit = async (additionalRecipients: string[]) => {
    if (!session) return;

    const rowsWithHours = taskRows.filter((r) => getRowTotalHours(r) > 0);
    const missingDesc = rowsWithHours.filter((r) => !r.description.trim());
    if (missingDesc.length > 0) {
      addToast("error", "Add a charge number or task description for each row that has hours.");
      return;
    }

    if (remarks.length > 500) {
      addToast("error", "Remarks must be 500 characters or less.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskRows,
          weeklyTotalHours,
          submitterEmail: session.email,
          submitterName: session.name,
          additionalRecipients,
          weekLabel,
          remarks,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      saveSubmission({
        submitterEmail: session.email,
        submitterName: session.name,
        weekLabel,
        entries: [],
        weeklyTotal: Math.round(weeklyTotalHours * 60),
        taskRows,
        remarks,
      });

      addToast("success", "Timecard submitted.");
    } catch (err) {
      addToast(
        "error",
        err instanceof Error ? err.message : "Failed to submit."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-koda-bg">
        <span className="w-8 h-8 border-2 border-koda-accent/30 border-t-koda-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-koda-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <KodaLogo size="md" />
            <div>
              <h1 className="text-sm font-semibold text-slate-900 text-koda-text">
                {employerBranding.timecardTitle.trim() || "Employee timecard"}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <label className="text-xs text-slate-600 text-koda-text-muted whitespace-nowrap">
                  Time card for week ending (Friday):
                </label>
                <select
                  value={weekOption}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "custom") {
                      setWeekOption("custom");
                      setCustomWeekDate(formatDateForInput(getWeekEndingFriday()));
                      setTaskRows(buildTaskRows(String(getWeekEndingFriday().getTime())));
                    } else {
                      const n = Number(v) as WeekOption;
                      setWeekOption(n);
                      const friday = getWeekEndingFridayByOffset(-n);
                      setTaskRows(buildTaskRows(String(friday.getTime())));
                    }
                  }}
                  className="text-xs font-mono text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-koda-accent"
                >
                  <option value={0}>This week</option>
                  <option value={1}>Last week</option>
                  <option value={2}>2 weeks ago</option>
                  <option value={3}>3 weeks ago</option>
                  <option value={4}>4 weeks ago</option>
                  <option value="custom">Custom date…</option>
                </select>
                {weekOption === "custom" && (
                  <input
                    type="date"
                    value={customWeekDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomWeekDate(val);
                      const friday = getWeekEndingFriday(parseDateFromInput(val));
                      setTaskRows(buildTaskRows(String(friday.getTime())));
                    }}
                    className="text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-koda-accent"
                  />
                )}
                <span className="text-xs text-slate-600 font-mono">{weekLabel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 text-koda-text-muted">{session.name}</span>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent"
            >
              Clear form
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Hours by day (enter number only, e.g. 8)
            </p>
            <TimecardGrid taskRows={taskRows} onChange={handleGridChange} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
          <label className="block px-4 py-3 border-b border-slate-200 text-sm font-medium text-slate-700">
            Remarks (limit 500 characters)
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value.slice(0, 500))}
            placeholder="Optional notes…"
            rows={3}
            className="w-full px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-koda-accent rounded-b-2xl resize-y"
          />
        </div>

        <SubmitFooter
          entries={[]}
          weeklyTotal={Math.round(weeklyTotalHours * 60)}
          weekLabel={weekLabel}
          submitterEmail={session.email}
          submitterName={session.name}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          simple
          summaryLabel={weeklyTotalHours > 0 ? `${weeklyTotalHours.toFixed(1)} hours` : undefined}
        />
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
