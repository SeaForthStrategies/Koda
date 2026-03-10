"use client";

import { Clock } from "lucide-react";

export function KodaLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 18, text: "text-lg" },
    md: { icon: 20, text: "text-xl" },
    lg: { icon: 24, text: "text-2xl" },
  };
  const s = sizes[size];

  return (
    <div className="inline-flex items-center gap-2">
      <Clock size={s.icon} className="text-koda-accent" />
      <span className={`${s.text} font-display font-bold text-koda-text tracking-tight`}>
        Koda
      </span>
    </div>
  );
}
