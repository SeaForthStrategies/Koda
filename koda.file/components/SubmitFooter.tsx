"use client";

import { useState } from "react";
import { Send, Users, Shield, X, ChevronDown } from "lucide-react";
import { DayEntry } from "@/types";
import { parseEmailList } from "@/lib/utils";

interface SubmitFooterProps {
  entries: DayEntry[];
  weeklyTotal: number;
  weekLabel: string;
  submitterEmail: string;
  submitterName: string;
  onSubmit: (additionalRecipients: string[]) => void;
  isSubmitting: boolean;
}

export function SubmitFooter({
  entries,
  weeklyTotal,
  weekLabel,
  submitterEmail,
  submitterName,
  onSubmit,
  isSubmitting,
}: SubmitFooterProps) {
  const [recipientInput, setRecipientInput] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [inputError, setInputError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const addRecipients = () => {
    const emails = parseEmailList(recipientInput);
    if (emails.length === 0) {
      setInputError("No valid email addresses found");
      return;
    }
    const newList = Array.from(new Set([...recipients, ...emails]));
    setRecipients(newList);
    setRecipientInput("");
    setInputError("");
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const activeEntries = entries.filter((e) => e.enabled);
  const hasTimeData = weeklyTotal > 0;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(16,16,25,0.95)",
        border: "1px solid rgba(30,30,46,0.8)",
      }}
    >
      {/* Collapsible recipients section */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Users size={16} className="text-koda-accent" />
          <span className="text-sm font-medium text-koda-text">
            Additional Recipients
          </span>
          {recipients.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(124,106,247,0.2)", color: "#a89df9" }}
            >
              {recipients.length}
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-koda-text-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="px-6 pb-5 border-t border-koda-border/50">
          <p className="text-xs text-koda-text-muted mt-4 mb-3">
            Add comma-separated email addresses to CC on the submission.
          </p>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="manager@company.com, hr@company.com"
              value={recipientInput}
              onChange={(e) => {
                setRecipientInput(e.target.value);
                setInputError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addRecipients();
                }
              }}
              className="flex-1 bg-koda-surface border border-koda-border rounded-lg px-4 py-2.5 text-koda-text text-sm focus:outline-none focus:border-koda-accent placeholder:text-koda-muted"
            />
            <button
              type="button"
              onClick={addRecipients}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "rgba(124,106,247,0.2)",
                color: "#a89df9",
                border: "1px solid rgba(124,106,247,0.3)",
              }}
            >
              Add
            </button>
          </div>

          {inputError && (
            <p className="text-xs text-koda-red mb-2">{inputError}</p>
          )}

          {recipients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipients.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(34,214,122,0.08)",
                    border: "1px solid rgba(34,214,122,0.2)",
                    color: "#22d67a",
                  }}
                >
                  <span className="font-mono">{email}</span>
                  <button
                    type="button"
                    onClick={() => removeRecipient(email)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit row */}
      <div
        className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(30,30,46,0.8)" }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-koda-text">
            <span className="text-koda-text-muted">Submitting as:</span>
            <span className="font-medium">{submitterName}</span>
            <span className="font-mono text-xs text-koda-text-muted">
              ({submitterEmail})
            </span>
          </div>
          <div className="text-xs text-koda-text-muted">
            {activeEntries.length} active day{activeEntries.length !== 1 ? "s" : ""} ·{" "}
            {weekLabel}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSubmit(recipients)}
          disabled={isSubmitting || !hasTimeData}
          className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: isSubmitting
              ? "rgba(124,106,247,0.3)"
              : "linear-gradient(135deg, #7c6af7, #6b5ce7)",
            color: "#fff",
            boxShadow: isSubmitting ? "none" : "0 4px 24px rgba(124,106,247,0.35)",
          }}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={15} />
              Submit Timecard
            </>
          )}
        </button>
      </div>

      {/* Legal note — fixed, non-editable */}
      <div
        className="px-6 py-4 flex gap-3"
        style={{
          background: "rgba(247,79,106,0.05)",
          borderTop: "1px solid rgba(247,79,106,0.15)",
        }}
      >
        <Shield size={14} className="text-koda-red mt-0.5 flex-shrink-0" />
        <p
          className="text-xs leading-relaxed select-none pointer-events-none"
          style={{ color: "rgba(247,79,106,0.7)" }}
        >
          <strong style={{ color: "rgba(247,79,106,0.9)" }}>
            Legal / Accuracy Notice:
          </strong>{" "}
          By submitting this timecard, I certify that the hours and descriptions
          reported herein are accurate, complete, and truthful to the best of my
          knowledge. I understand that falsification of time records may result
          in disciplinary action up to and including termination of employment,
          and may be subject to applicable civil and criminal penalties under
          federal and state labor laws.
        </p>
      </div>
    </div>
  );
}
