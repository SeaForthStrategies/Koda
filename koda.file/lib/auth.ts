/**
 * Minimal session handling using sessionStorage.
 * In production, replace with a proper auth solution (NextAuth, Clerk, etc.)
 */

const SESSION_KEY = "koda_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export interface Session {
  email: string;
  name: string;
  createdAt: number;
}

export function createSession(email: string, name: string): void {
  if (typeof window === "undefined") return;
  const session: Session = { email, name, createdAt: Date.now() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: Session = JSON.parse(raw);
    if (Date.now() - session.createdAt > SESSION_DURATION) {
      clearSession();
      return null;
    }
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
 * Demo credentials — replace with real auth.
 * In production use environment variables and a database lookup.
 */
export const DEMO_CREDENTIALS = {
  email: "demo@koda.app",
  password: "koda2025",
  name: "Alex Rivera",
};
