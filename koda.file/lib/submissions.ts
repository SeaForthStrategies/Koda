import type { DayEntry } from "@/types";
import type { StoredSubmission } from "@/types";

const STORAGE_KEY = "koda_submissions";

export function getStoredSubmissions(): StoredSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSubmission(payload: {
  submitterEmail: string;
  submitterName: string;
  weekLabel: string;
  entries: DayEntry[];
  weeklyTotal: number;
}): void {
  const list = getStoredSubmissions();
  const submission: StoredSubmission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    ...payload,
    submittedAt: Date.now(),
  };
  list.unshift(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
