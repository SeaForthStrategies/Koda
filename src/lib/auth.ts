import { createClient } from "@/lib/supabase/server";

export type UserRole = "employee" | "employer";
export type CurrentUser = { id: string; email: string; role: UserRole };

const AUTH_TIMEOUT_MS = 1500;

/** Get the current Supabase user and profile role; null if not signed in or Supabase not configured. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Auth timeout")), AUTH_TIMEOUT_MS)
      ),
    ]);
    const { data: { user }, error } = result;
    if (error || !user?.email) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role: UserRole =
      profile?.role === "employer" ? "employer" : "employee";
    return { id: user.id, email: user.email, role };
  } catch {
    return null;
  }
}

/** Email of the current user, or null. Kept for backward compatibility. */
export async function getSession(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.email ?? null;
}
