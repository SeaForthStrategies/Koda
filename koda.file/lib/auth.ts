/**
 * Minimal session handling using sessionStorage.
 * In production, replace with a proper auth solution (NextAuth, Clerk, etc.)
 */

const SESSION_KEY = "koda_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export type Role = "employee" | "employer";

export interface Session {
  email: string;
  name: string;
  role: Role;
  createdAt: number;
}

export function createSession(email: string, name: string, role: Role): void {
  if (typeof window === "undefined") return;
  const session: Session = { email, name, role, createdAt: Date.now() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - (parsed.createdAt ?? 0) > SESSION_DURATION) {
      clearSession();
      return null;
    }
    const session: Session = {
      email: parsed.email,
      name: parsed.name,
      role: parsed.role === "employer" ? "employer" : "employee",
      createdAt: parsed.createdAt,
    };
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Demo credentials — replace with real auth in production.
 */
export const DEMO_EMPLOYEE = {
  email: "demo@koda.app",
  password: "koda2025",
  name: "Alex Rivera",
  role: "employee" as Role,
};

export const DEMO_EMPLOYER = {
  email: "employer@koda.app",
  password: "koda2025",
  name: "Jordan Kim",
  role: "employer" as Role,
};

/** @deprecated Use DEMO_EMPLOYEE for employee login. */
export const DEMO_CREDENTIALS = DEMO_EMPLOYEE;

export function getDemoUser(email: string, password: string): typeof DEMO_EMPLOYEE | null {
  if (email === DEMO_EMPLOYEE.email && password === DEMO_EMPLOYEE.password) return DEMO_EMPLOYEE;
  if (email === DEMO_EMPLOYER.email && password === DEMO_EMPLOYER.password) return DEMO_EMPLOYER;
  return null;
}
