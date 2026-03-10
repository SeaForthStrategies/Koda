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

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const weekLabel = useMemo(() => getWeekLabel(getWeekStart()), []);

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
    setEntries(buildWeekEntries());
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <KodaLogo size="md" />
            <div>
              <h1 className="text-sm font-semibold text-koda-text">My timecard</h1>
              <p className="text-xs text-koda-text-muted font-mono">{weekLabel}</p>
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

        <div className="mb-5">
          <WeeklyTotal
            entries={processedEntries}
            weeklyTotal={weeklyTotal}
            weekLabel={weekLabel}
          />
        </div>

        <div className="bg-white rounded-2xl border border-koda-border shadow-sm overflow-hidden mb-4">
          <div className="hidden lg:grid lg:grid-cols-[140px_100px_100px_1fr_80px] lg:gap-4 lg:px-5 lg:py-3 bg-slate-50 border-b border-koda-border text-xs font-medium text-koda-text-muted uppercase tracking-wider">
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
