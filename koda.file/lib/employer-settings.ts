import type { EmployerSettings } from "@/types";

const STORAGE_KEY = "koda_employer_settings";

export const defaultEmployerSettings: EmployerSettings = {
  companyName: "",
  timecardTitle: "",
  defaultCcEmails: "",
  weekEndingLabel: "Week ending (Friday)",
};

export function getEmployerSettings(): EmployerSettings {
  if (typeof window === "undefined") return defaultEmployerSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEmployerSettings;
    const parsed = JSON.parse(raw) as Partial<EmployerSettings>;
    return { ...defaultEmployerSettings, ...parsed };
  } catch {
    return defaultEmployerSettings;
  }
}

export function saveEmployerSettings(settings: Partial<EmployerSettings>): void {
  if (typeof window === "undefined") return;
  const current = getEmployerSettings();
  const next = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

/** For employee dashboard: show customized title/company when employer settings exist (e.g. same browser). */
export function getPublicEmployerSettings(): Pick<EmployerSettings, "companyName" | "timecardTitle"> {
  const s = getEmployerSettings();
  return { companyName: s.companyName, timecardTitle: s.timecardTitle };
}
