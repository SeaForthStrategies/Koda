"use client";
import { Clock } from "lucide-react";

export function KodaLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 16, text: "text-lg", gap: "gap-2", pad: "px-3 py-1.5" },
    md: { icon: 20, text: "text-xl", gap: "gap-2.5", pad: "px-4 py-2" },
    lg: { icon: 26, text: "text-2xl", gap: "gap-3", pad: "px-5 py-2.5" },
  };
  const s = sizes[size];

  return (
    <div
      className={`inline-flex items-center ${s.gap} ${s.pad} rounded-xl`}
      style={{
        background: "rgba(124,106,247,0.12)",
        border: "1px solid rgba(124,106,247,0.25)",
      }}
    >
      <Clock size={s.icon} className="text-koda-accent-light" />
      <span
        className={`${s.text} font-display font-bold tracking-tight text-koda-text`}
        style={{ letterSpacing: "-0.03em" }}
      >
        KODA
      </span>
    </div>
  );
}
