import { NextRequest, NextResponse } from "next/server";
import { submitSchema, submitGridSchema } from "@/lib/schemas";
import { generateEmailHTML, generateEmailHTMLForGrid } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Grid timecard (hours per day, task rows)
    const gridResult = submitGridSchema.safeParse(body);
    if (gridResult.success) {
      const {
        taskRows,
        weeklyTotalHours,
        submitterEmail,
        submitterName,
        additionalRecipients,
        weekLabel,
        remarks,
      } = gridResult.data;

      const allRecipients = [
        submitterEmail,
        ...additionalRecipients.filter((r) => r !== submitterEmail),
      ];

      const html = generateEmailHTMLForGrid(
        taskRows,
        weeklyTotalHours,
        submitterName,
        weekLabel,
        remarks
      );

      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpPort = parseInt(process.env.SMTP_PORT || "587");
      const fromEmail = process.env.FROM_EMAIL || "noreply@koda.app";

      if (smtpHost && smtpUser && smtpPass) {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.default.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"Koda Time Tracking" <${fromEmail}>`,
          to: allRecipients,
          subject: `⏱ Timecard — ${weekLabel} · ${submitterName}`,
          html,
        });
      } else {
        console.log("\n📧 [Koda] Grid timecard would be sent to:", allRecipients);
        console.log("📋 Subject: Timecard —", weekLabel);
        console.log("📊 Total hours:", weeklyTotalHours.toFixed(1) + "h\n");
      }

      return NextResponse.json({
        success: true,
        recipientCount: allRecipients.length,
        message: smtpHost && smtpUser && smtpPass ? "Email sent successfully" : "Submission recorded.",
      });
    }

    // Legacy: day entries (clock in/out)
    const result = submitSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const {
      entries,
      weeklyTotal,
      submitterEmail,
      submitterName,
      additionalRecipients,
      weekLabel,
    } = result.data;

    const activeEntries = entries.filter((e) => e.enabled);
    if (activeEntries.length === 0) {
      return NextResponse.json(
        { error: "No active time entries to submit." },
        { status: 400 }
      );
    }

    const allRecipients = [
      submitterEmail,
      ...additionalRecipients.filter((r) => r !== submitterEmail),
    ];

    const html = generateEmailHTML(
      entries,
      weeklyTotal,
      submitterName,
      weekLabel
    );

    // Send email if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const fromEmail = process.env.FROM_EMAIL || "noreply@koda.app";

    if (smtpHost && smtpUser && smtpPass) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Koda Time Tracking" <${fromEmail}>`,
        to: allRecipients,
        subject: `⏱ Timecard Submitted — ${weekLabel} · ${submitterName}`,
        html,
      });

      return NextResponse.json({
        success: true,
        recipientCount: allRecipients.length,
        message: "Email sent successfully",
      });
    }

    // Development: log to console if SMTP not configured
    console.log("\n📧 [Koda] Email would be sent to:", allRecipients);
    console.log("📋 Subject: Timecard Submitted —", weekLabel);
    console.log("👤 From:", submitterName, `<${submitterEmail}>`);
    console.log(
      "📊 Total hours:",
      (weeklyTotal / 60).toFixed(2) + "h",
      `(${activeEntries.length} active days)\n`
    );

    return NextResponse.json({
      success: true,
      recipientCount: allRecipients.length,
      message:
        "Submission recorded. (Email not sent — configure SMTP in .env to enable real delivery.)",
    });
  } catch (err) {
    console.error("[Koda API] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "Koda API is running" });
}
