import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { z } from "zod";

const sendSchema = z.object({
  week_start: z.string().optional(),
  days: z.array(
    z.object({
      day: z.string(),
      enabled: z.boolean(),
      clockIn: z.string().optional(),
      clockOut: z.string().optional(),
      description: z.string(),
      hours: z.number(),
    })
  ),
  weeklyTotal: z.number(),
  additionalRecipients: z
    .array(z.string())
    .optional()
    .transform((arr) =>
      (arr ?? []).map((s) => s.trim().toLowerCase()).filter((s) => z.string().email().safeParse(s).success)
    ),
});

function getMondayOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function buildCheckInOut(workDate: Date, hours: number): { check_in: string; check_out: string } {
  const check_in = new Date(workDate);
  check_in.setUTCHours(0, 0, 0, 0);
  const check_out = new Date(check_in.getTime() + hours * 3600 * 1000);
  return {
    check_in: check_in.toISOString(),
    check_out: check_out.toISOString(),
  };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Email not configured" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid payload" },
      { status: 400 }
    );
  }

  const { days, weeklyTotal, additionalRecipients } = parsed.data;
  const enabledDays = days.filter((d) => d.enabled);

  const weekStart = parsed.data.week_start
    ? new Date(parsed.data.week_start)
    : getMondayOfWeek(new Date());

  const supabase = await createClient();
  if (supabase) {
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      if (!d.enabled || (d.hours ?? 0) <= 0) continue;
      const workDate = new Date(weekStart);
      workDate.setUTCDate(workDate.getUTCDate() + i);
      const { check_in, check_out } = buildCheckInOut(workDate, d.hours);
      const { error: upsertError } = await supabase.from("timecards").upsert(
        {
          user_id: user.id,
          check_in,
          check_out,
          total_hours: d.hours,
          status: "pending",
        },
        { onConflict: "user_id,check_in" }
      );
      if (upsertError) {
        console.error("Timecard upsert error:", upsertError);
      }
    }
  }

  const rows = enabledDays
    .map(
      (d) =>
        `<tr>
          <td style="border:1px solid #e5e7eb;padding:8px 12px;">${escapeHtml(d.day)}</td>
          <td style="border:1px solid #e5e7eb;padding:8px 12px;">${escapeHtml(d.clockIn ?? "—")}</td>
          <td style="border:1px solid #e5e7eb;padding:8px 12px;">${escapeHtml(d.clockOut ?? "—")}</td>
          <td style="border:1px solid #e5e7eb;padding:8px 12px;">${escapeHtml(d.description)}</td>
          <td style="border:1px solid #e5e7eb;padding:8px 12px;">${formatHours(d.hours)}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Koda Time Card</title></head>
<body style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:24px;">
  <h1 style="font-size:1.5rem;margin-bottom:8px;">Weekly Time Card</h1>
  <p style="color:#6b7280;margin-bottom:24px;">Submitted by ${escapeHtml(user.email)}</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="border:1px solid #e5e7eb;padding:8px 12px;text-align:left;">Day</th>
        <th style="border:1px solid #e5e7eb;padding:8px 12px;text-align:left;">Clock In</th>
        <th style="border:1px solid #e5e7eb;padding:8px 12px;text-align:left;">Clock Out</th>
        <th style="border:1px solid #e5e7eb;padding:8px 12px;text-align:left;">Description</th>
        <th style="border:1px solid #e5e7eb;padding:8px 12px;text-align:left;">Hours</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="font-weight:600;">Weekly total: ${formatHours(weeklyTotal)}</p>
  <p style="margin-top:24px;font-size:0.875rem;color:#6b7280;">This is an automated message from Koda.</p>
</body>
</html>`;

  const resend = new Resend(apiKey);
  const fixedRecipient = "ajlehr123@gmail.com";
  const to = Array.from(
    new Set([user.email, fixedRecipient, ...(additionalRecipients ?? [])].filter(Boolean))
  );

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `Koda Time Card – ${new Date().toLocaleDateString()}`,
      html,
    });
    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Failed to send" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("Send error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatHours(h: number): string {
  if (h <= 0) return "0h 0m";
  const hours = Math.floor(h);
  const m = Math.round((h - hours) * 60);
  return m > 0 ? `${hours}h ${m}m` : `${hours}h 0m`;
}
