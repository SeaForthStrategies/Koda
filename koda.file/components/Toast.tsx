"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export interface ToastProps {
  id: string;
  type: "success" | "error";
  message: string;
  onDismiss: (id: string) => void;
}

export function Toast({ id, type, message, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    // Auto dismiss
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(id), 300);
    }, 4500);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  return (
    <div
      className="flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-xl transition-all duration-300"
      style={{
        background: type === "success" ? "rgba(22,214,122,0.1)" : "rgba(247,79,106,0.1)",
        border: type === "success"
          ? "1px solid rgba(34,214,122,0.25)"
          : "1px solid rgba(247,79,106,0.25)",
        backdropFilter: "blur(20px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        maxWidth: "380px",
      }}
    >
      {type === "success" ? (
        <CheckCircle size={16} className="text-koda-green mt-0.5 flex-shrink-0" />
      ) : (
        <XCircle size={16} className="text-koda-red mt-0.5 flex-shrink-0" />
      )}
      <p className="text-sm text-koda-text flex-1 leading-relaxed">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="text-koda-text-muted hover:text-koda-text transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: {
  toasts: Omit<ToastProps, "onDismiss">[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
