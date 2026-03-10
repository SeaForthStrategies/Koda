"use client";

import { useState } from "react";
import { Send, Users, ChevronDown, X } from "lucide-react";
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
  /** When true, hide CC recipients (employee simple flow). */
  simple?: boolean;
}

export function SubmitFooter({
  entries,
  weeklyTotal,
  weekLabel,
  submitterEmail,
  submitterName,
  onSubmit,
  isSubmitting,
  simple = false,
}: SubmitFooterProps) {
  const [recipientInput, setRecipientInput] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [inputError, setInputError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const effectiveRecipients = simple ? [] : recipients;

  const addRecipients = () => {
    const emails = parseEmailList(recipientInput);
    if (emails.length === 0) {
      setInputError("Enter at least one valid email");
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
    <div className="bg-white rounded-2xl border border-koda-border shadow-sm overflow-hidden">
      {/* Additional recipients - collapsible (hidden in simple mode) */}
      {!simple && (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left border-b border-koda-border hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-koda-text">
              <Users size={16} className="text-koda-muted" />
              CC recipients
              {recipients.length > 0 && (
                <span className="text-xs font-normal text-koda-muted">({recipients.length})</span>
              )}
            </span>
            <ChevronDown
              size={16}
              className={`text-koda-muted transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
          {expanded && (
            <div className="px-5 py-4 border-b border-koda-border bg-slate-50/50">
              <p className="text-xs text-koda-text-muted mb-2">
                Add email addresses to receive a copy (comma-separated).
              </p>
              <div className="flex gap-2 mb-2">
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
                  className="flex-1 border border-koda-border rounded-lg px-3 py-2 text-sm text-koda-text placeholder:text-koda-muted focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent bg-white"
                />
                <button
                  type="button"
                  onClick={addRecipients}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-koda-accent hover:bg-slate-100 border border-koda-border transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              {inputError && <p className="text-xs text-koda-red mb-2">{inputError}</p>}
              {recipients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipients.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-white border border-koda-border text-koda-text font-mono"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => removeRecipient(email)}
                        className="hover:text-koda-red text-koda-muted"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Submit row */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-koda-text">
            Submitting as <strong>{submitterName}</strong>
            <span className="text-koda-text-muted font-mono text-xs ml-1">({submitterEmail})</span>
          </p>
          <p className="text-xs text-koda-text-muted mt-0.5">
            {activeEntries.length} day{activeEntries.length !== 1 ? "s" : ""} · {weekLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSubmit(effectiveRecipients)}
          disabled={isSubmitting || !hasTimeData}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-koda-accent hover:bg-koda-accent/90 focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Submit timecard
            </>
          )}
        </button>
      </div>

      {/* Legal notice */}
      <div className="px-5 py-3 bg-amber-50/80 border-t border-amber-200/80">
        <p className="text-xs text-amber-900/90 leading-relaxed select-none">
          <strong>Accuracy certification:</strong> By submitting, I certify that the hours and
          descriptions are accurate and complete. Falsification may result in disciplinary action
          and applicable legal penalties.
        </p>
      </div>
    </div>
  );
}
