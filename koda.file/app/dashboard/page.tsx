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
  const [session, setSession] = useState<{ email: string; name: string } | null>(null);
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const weekLabel = useMemo(() => getWeekLabel(getWeekStart()), []);

  // Auth check
  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);
    setEntries(buildWeekEntries());
  }, [router]);

  // Recalculate daily totals whenever entries change
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
    addToast("success", "Timecard reset to defaults.");
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const handleSubmit = async (additionalRecipients: string[]) => {
    if (!session) return;

    // Validate active entries have descriptions
    const missingDesc = processedEntries.filter(
      (e) => e.enabled && e.dailyTotal > 0 && !e.description.trim()
    );
    if (missingDesc.length > 0) {
      addToast(
        "error",
        `Please add descriptions for: ${missingDesc.map((e) => e.day).join(", ")}`
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

      addToast("success", `Timecard submitted! Sent to ${data.recipientCount} recipient(s).`);
    } catch (err) {
      addToast(
        "error",
        err instanceof Error ? err.message : "Failed to submit timecard."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-koda-accent/30 border-t-koda-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* Mesh gradient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(at 20% 10%, rgba(124,106,247,0.08) 0%, transparent 50%), radial-gradient(at 80% 90%, rgba(34,214,122,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <KodaLogo size="md" />
            <div className="hidden sm:block w-px h-8 bg-koda-border" />
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-koda-text">
                Weekly Timecard
              </div>
              <div className="text-xs text-koda-text-muted font-mono">
                {weekLabel}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "rgba(124,106,247,0.2)",
                  color: "#a89df9",
                }}
              >
                {session.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-koda-text-muted">{session.name}</span>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-koda-text-muted hover:text-koda-text transition-colors"
              style={{ border: "1px solid rgba(30,30,46,0.8)" }}
              title="Reset to defaults"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors"
              style={{
                border: "1px solid rgba(247,79,106,0.2)",
                color: "rgba(247,79,106,0.7)",
              }}
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Weekly Total Summary */}
        <div className="mb-6 animate-slide-up">
          <WeeklyTotal
            entries={processedEntries}
            weeklyTotal={weeklyTotal}
            weekLabel={weekLabel}
          />
        </div>

        {/* Column headers — desktop only */}
        <div className="hidden lg:grid lg:grid-cols-[auto_1fr_1fr_2fr_auto] items-center gap-4 px-5 mb-2">
          <div className="min-w-[160px] text-xs text-koda-text-muted uppercase tracking-widest font-semibold">
            Day
          </div>
          <div className="text-xs text-koda-text-muted uppercase tracking-widest font-semibold">
            Clock In
          </div>
          <div className="text-xs text-koda-text-muted uppercase tracking-widest font-semibold">
            Clock Out
          </div>
          <div className="text-xs text-koda-text-muted uppercase tracking-widest font-semibold">
            Description *
          </div>
          <div className="min-w-[80px] text-xs text-koda-text-muted uppercase tracking-widest font-semibold text-center">
            Total
          </div>
        </div>

        {/* Time rows */}
        <div className="space-y-2 mb-6">
          {processedEntries.map((entry, i) => (
            <div
              key={entry.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <TimeRow entry={entry} onChange={handleChange} />
            </div>
          ))}
        </div>

        {/* Submit footer */}
        <div className="animate-slide-up" style={{ animationDelay: "320ms" }}>
          <SubmitFooter
            entries={processedEntries}
            weeklyTotal={weeklyTotal}
            weekLabel={weekLabel}
            submitterEmail={session.email}
            submitterName={session.name}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-koda-muted mt-8 pb-4">
          Koda Time Tracking · All data is processed securely
        </p>
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
