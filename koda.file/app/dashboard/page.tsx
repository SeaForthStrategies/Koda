"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw } from "lucide-react";
import { DayEntry } from "@/types";
import {
  buildWeekEntries,
  calculateDuration,
  getWeekLabel,
  getWeekStart,
  getWeekStartByOffset,
  formatDateForInput,
  parseDateFromInput,
} from "@/lib/utils";
import { getSession, clearSession } from "@/lib/auth";
import { saveSubmission } from "@/lib/submissions";
import { TimeRow } from "@/components/TimeRow";
import { WeeklyTotal } from "@/components/WeeklyTotal";
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
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [weekOption, setWeekOption] = useState<WeekOption>(0);
  const [customWeekDate, setCustomWeekDate] = useState<string>(() =>
    formatDateForInput(getWeekStart())
  );

  const weekStart = useMemo(() => {
    if (weekOption === "custom") {
      return parseDateFromInput(customWeekDate);
    }
    return getWeekStartByOffset(-weekOption);
  }, [weekOption, customWeekDate]);

  const weekLabel = useMemo(() => getWeekLabel(weekStart), [weekStart]);

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
    setEntries(buildWeekEntries());
  }, [router]);


  const processedEntries = useMemo<DayEntry[]>(() => {
    return entries.map((e) => ({
      ...e,
      dailyTotal: e.enabled ? calculateDuration(e.clockIn, e.clockOut) : 0,
    }));
  }, [entries]);

  const weeklyTotal = useMemo(
    () => processedEntries.reduce((sum, e) => sum + e.dailyTotal, 0),
    [processedEntries]
  );

  const handleChange = useCallback(
    (id: string, field: keyof DayEntry, value: string | boolean) => {
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      );
    },
    []
  );

  const addToast = useCallback((type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleReset = () => {
    setEntries(buildWeekEntries(weekStart));
    addToast("success", "Timecard reset.");
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const handleSubmit = async (additionalRecipients: string[]) => {
    if (!session) return;

    const missingDesc = processedEntries.filter(
      (e) => e.enabled && e.dailyTotal > 0 && !e.description.trim()
    );
    if (missingDesc.length > 0) {
      addToast(
        "error",
        `Add descriptions for: ${missingDesc.map((e) => e.day).join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: processedEntries,
          weeklyTotal,
          submitterEmail: session.email,
          submitterName: session.name,
          additionalRecipients,
          weekLabel,
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
        entries: processedEntries,
        weeklyTotal,
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <KodaLogo size="md" />
            <div>
              <h1 className="text-sm font-semibold text-koda-text">My timecard</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <select
                  value={weekOption}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "custom") {
                      setWeekOption("custom");
                      setCustomWeekDate(formatDateForInput(getWeekStart()));
                      setEntries(buildWeekEntries(getWeekStart()));
                    } else {
                      const n = Number(v) as WeekOption;
                      setWeekOption(n);
                      const start = getWeekStartByOffset(-n);
                      setEntries(buildWeekEntries(start));
                    }
                  }}
                  className="text-xs font-mono text-koda-text-muted bg-slate-50 border border-koda-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-koda-accent"
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
                      const start = getWeekStart(parseDateFromInput(val));
                      setEntries(buildWeekEntries(start));
                    }}
                    className="text-xs font-mono text-koda-text bg-white border border-koda-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-koda-accent"
                  />
                )}
                <span className="text-xs text-koda-text-muted font-mono">{weekLabel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-koda-text-muted">{session.name}</span>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-lg text-sm text-koda-text-muted hover:bg-slate-100 border border-koda-border transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-sm text-koda-red hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="mb-3">
          <WeeklyTotal
            entries={processedEntries}
            weeklyTotal={weeklyTotal}
            weekLabel={weekLabel}
          />
        </div>

        <div className="bg-white rounded-2xl border border-koda-border shadow-sm overflow-hidden mb-3">
          <div className="hidden lg:grid lg:grid-cols-[140px_100px_100px_1fr_80px] lg:gap-3 lg:px-4 lg:py-2 bg-slate-50 border-b border-koda-border text-xs font-medium text-koda-text-muted uppercase tracking-wider">
            <div>Day</div>
            <div>In</div>
            <div>Out</div>
            <div>Description</div>
            <div className="text-center">Total</div>
          </div>
          {processedEntries.map((entry) => (
            <TimeRow key={entry.id} entry={entry} onChange={handleChange} />
          ))}
        </div>

        <SubmitFooter
          entries={processedEntries}
          weeklyTotal={weeklyTotal}
          weekLabel={weekLabel}
          submitterEmail={session.email}
          submitterName={session.name}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          simple
        />
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
