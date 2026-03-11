"use client";

import { useMemo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatHours, getMondayOfWeek } from "@/lib/time";
import type { DayEntry } from "@/lib/validators";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const defaultDay = (): DayEntry => ({
  enabled: false,
  hours: 0,
  description: "",
});

export function WeeklyTimeCard() {
  const [days, setDays] = useState<DayEntry[]>(() =>
    Array.from({ length: 7 }, defaultDay)
  );
  const [additionalRecipients, setAdditionalRecipients] = useState("");
  const [securityInput, setSecurityInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [securityCode, setSecurityCode] = useState(() =>
    String(Math.floor(1000 + Math.random() * 9000))
  );

  const regenerateSecurityCode = useCallback(() => {
    setSecurityCode(String(Math.floor(1000 + Math.random() * 9000)));
    setSecurityInput("");
  }, []);

  const updateDay = useCallback((index: number, patch: Partial<DayEntry>) => {
    setDays((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  const dailyTotals = useMemo(() => {
    return days.map((d) => (d.enabled ? (d.hours ?? 0) : 0));
  }, [days]);

  const weeklyTotal = useMemo(
    () => dailyTotals.reduce((a, b) => a + b, 0),
    [dailyTotals]
  );

  const handleSubmit = async () => {
    if (securityInput.trim() !== securityCode) {
      setSendMessage({ type: "error", text: "Security code doesn't match. Type the numbers shown above." });
      regenerateSecurityCode();
      return;
    }
    setSending(true);
    setSendMessage(null);
    try {
      const monday = getMondayOfWeek(new Date());
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          week_start: monday.toISOString().slice(0, 10),
          days: days.map((d, i) => ({
            day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i],
            enabled: d.enabled,
            clockIn: undefined,
            clockOut: undefined,
            description: d.description ?? "",
            hours: dailyTotals[i],
          })),
          weeklyTotal,
          additionalRecipients: additionalRecipients
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendMessage({ type: "error", text: data.error ?? "Failed to send" });
        return;
      }
      setSendMessage({ type: "ok", text: "Submitted." });
      regenerateSecurityCode();
    } catch {
      setSendMessage({ type: "error", text: "Network error." });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="glass overflow-hidden border-border/60 shadow-md">
      <CardHeader className="border-b border-border/60 bg-muted/30 px-5 py-4 sm:px-6 sm:py-5">
        <CardTitle className="text-base font-semibold sm:text-lg">Weekly time card</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">Check days, add hours and details, then submit.</p>
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Days</p>
          {days.map((day, i) => (
            <div
              key={i}
              className={`flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-muted/20 px-3 py-2.5 transition-colors sm:flex-nowrap sm:px-3 sm:py-2 ${!day.enabled ? "opacity-60" : ""}`}
            >
              <div className="flex shrink-0 items-center gap-2">
                <Checkbox
                  aria-label={`Include ${DAYS[i]}`}
                  checked={day.enabled}
                  onChange={(e) => updateDay(i, { enabled: e.target.checked })}
                  className="h-4 w-4 shrink-0"
                />
                <span className="w-9 shrink-0 text-sm font-medium tabular-nums">{DAYS[i]}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Label htmlFor={`hours-${i}`} className="sr-only">Hours for {DAYS[i]}</Label>
                <Input
                  id={`hours-${i}`}
                  type="number"
                  min={0}
                  max={24}
                  step={0.25}
                  placeholder="0"
                  value={day.hours !== undefined && day.hours > 0 ? day.hours : ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    const n = v === "" ? 0 : Math.min(24, Math.max(0, Number.parseFloat(v) || 0));
                    updateDay(i, { hours: n });
                  }}
                  disabled={!day.enabled}
                  className="h-9 min-h-[44px] w-14 shrink-0 text-center text-sm tabular-nums sm:h-9 sm:min-h-0"
                />
                <span className="text-xs text-muted-foreground">hrs</span>
              </div>
              <div className="w-full min-w-0 flex-1 sm:min-w-[120px]">
                <Label htmlFor={`desc-${i}`} className="sr-only">Details for {DAYS[i]}</Label>
                <Input
                  id={`desc-${i}`}
                  placeholder="Details"
                  value={day.description ?? ""}
                  onChange={(e) => updateDay(i, { description: e.target.value })}
                  disabled={!day.enabled}
                  className="h-9 min-h-[44px] w-full text-sm sm:min-h-0"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center rounded-xl border border-border/80 bg-muted/20 px-4 py-3">
          <span className="text-sm font-medium text-muted-foreground">Weekly total</span>
          <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
            {formatHours(weeklyTotal)}
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipients" className="text-sm font-medium">
            Additional recipients
          </Label>
          <Input
            id="recipients"
            placeholder="email@example.com (comma-separated)"
            value={additionalRecipients}
            onChange={(e) => setAdditionalRecipients(e.target.value)}
            className="h-10"
          />
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3">
          <Label htmlFor="security-code" className="text-sm font-medium">
            Security
          </Label>
          <p className="text-sm text-muted-foreground">
            Type these numbers to confirm:{" "}
            <span className="font-mono font-bold tracking-widest text-foreground break-all">
              {securityCode}
            </span>
          </p>
          <Input
            id="security-code"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 8808"
            value={securityInput}
            onChange={(e) => setSecurityInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="h-10 w-28 font-mono text-center text-base tracking-widest"
            maxLength={4}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          By submitting, you confirm this information is accurate.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/20 px-5 py-4 sm:px-6 sm:py-5">
        {sendMessage && (
          <p
            className={
              sendMessage.type === "ok"
                ? "text-sm text-muted-foreground"
                : "text-sm text-destructive font-medium"
            }
          >
            {sendMessage.text}
          </p>
        )}
        <Button
          onClick={handleSubmit}
          disabled={sending}
          className="h-11 w-full"
          size="lg"
        >
          {sending ? "Submitting…" : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
