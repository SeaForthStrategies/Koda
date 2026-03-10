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
};
