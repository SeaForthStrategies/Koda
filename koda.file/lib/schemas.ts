import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  honeypot: z.string().max(0, "Bot detected"), // Must be empty
});

export const dayEntrySchema = z.object({
  id: z.string(),
  day: z.string(),
  dayShort: z.string(),
  date: z.string(),
  enabled: z.boolean(),
  clockIn: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time").or(z.literal("")),
  clockOut: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time").or(z.literal("")),
  description: z.string().max(500, "Description too long"),
  dailyTotal: z.number().min(0),
});

export const submitSchema = z.object({
  entries: z.array(dayEntrySchema),
  weeklyTotal: z.number().min(0),
  submitterEmail: z.string().email("Valid submitter email required"),
  submitterName: z.string().min(1, "Name is required"),
  additionalRecipients: z.array(z.string().email()).max(10, "Max 10 recipients"),
  weekLabel: z.string(),
});

const taskRowSchema = z.object({
  id: z.string(),
  sat: z.string(),
  sun: z.string(),
  mon: z.string(),
  tue: z.string(),
  wed: z.string(),
  thu: z.string(),
  fri: z.string(),
  description: z.string().max(500),
});

export const submitGridSchema = z.object({
  taskRows: z.array(taskRowSchema),
  weeklyTotalHours: z.number().min(0),
  submitterEmail: z.string().email("Valid submitter email required"),
  submitterName: z.string().min(1, "Name is required"),
  additionalRecipients: z.array(z.string().email()).max(10, "Max 10 recipients"),
  weekLabel: z.string(),
  remarks: z.string().max(500),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SubmitInput = z.infer<typeof submitSchema>;
export type SubmitGridInput = z.infer<typeof submitGridSchema>;
