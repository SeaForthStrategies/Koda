export type DayEntry = {
  id: string;
  day: string;
  dayShort: string;
  date: string;
  enabled: boolean;
  clockIn: string;
  clockOut: string;
  description: string;
  dailyTotal: number; // in minutes
};

/** Grid timecard: one row per task/charge, hours per day (number only). */
export type TaskRow = {
  id: string;
  sat: string;
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  description: string;
};

export const DAY_KEYS = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export type WeekData = {
  entries: DayEntry[];
  weeklyTotal: number; // in minutes
  weekLabel: string;
};

export type SubmitPayload = {
  entries: DayEntry[];
  weeklyTotal: number;
  submitterEmail: string;
  additionalRecipients: string[];
  submitterName: string;
};

export type EmailPayload = {
  to: string[];
  subject: string;
  html: string;
};

export type StoredSubmission = {
  id: string;
  submitterEmail: string;
  submitterName: string;
  weekLabel: string;
  entries: DayEntry[];
  weeklyTotal: number;
  submittedAt: number;
  /** Grid timecard data (hours per day, task rows). When set, use this instead of entries for display. */
  taskRows?: TaskRow[];
  remarks?: string;
};

export type EmployerSettings = {
  companyName: string;
  timecardTitle: string;
  defaultCcEmails: string;
  weekEndingLabel: string;
};
