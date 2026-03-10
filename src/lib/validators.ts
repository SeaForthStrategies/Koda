import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
  /** Honeypot: must be empty to pass (bot trap) */
  website: z.string().max(0).optional(),
});

export const dayEntrySchema = z.object({
  enabled: z.boolean(),
  clockIn: z.string().regex(/^\d{1,2}:\d{2}$/).optional(),
  clockOut: z.string().regex(/^\d{1,2}:\d{2}$/).optional(),
  /** Direct hours for the day (e.g. 8); used when no clock in/out. */
  hours: z.number().min(0).max(24).optional(),
  description: z.string().optional(),
});

export const weeklyTimeCardSchema = z.object({
  days: z.array(dayEntrySchema).length(7),
  additionalRecipients: z.string().optional(),
});

export const signupSchema = z.object({
  firstName: z.string().min(1, "First name required").max(100),
  lastName: z.string().min(1, "Last name required").max(100),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  website: z.string().max(0).optional(),
  /** Team join code from employer (6 chars); links this account to that workspace. */
  joinCode: z.string().max(10).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type DayEntry = z.infer<typeof dayEntrySchema>;
export type WeeklyTimeCard = z.infer<typeof weeklyTimeCardSchema>;
