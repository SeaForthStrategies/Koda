import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrCreateWorkspaceForOwner } from "@/services/workspace";
import { loginSchema } from "@/lib/validators";
import type { UserRole } from "@/lib/auth";

const EMPLOYER_EMAILS = (process.env.EMPLOYER_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const { email, password, website } = parsed.data;
    if (website && website.length > 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Auth not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." },
        { status: 503 }
      );
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Invalid credentials" },
        { status: 401 }
      );
    }
    if (!data.user) {
      return NextResponse.json({ error: "Login failed" }, { status: 401 });
    }

    let role: UserRole = "employee";
    if (EMPLOYER_EMAILS.includes(email.trim().toLowerCase())) {
      await supabase
        .from("profiles")
        .update({ role: "employer", updated_at: new Date().toISOString() })
        .eq("id", data.user.id);
      role = "employer";
      const admin = createAdminClient();
      if (admin) {
        await getOrCreateWorkspaceForOwner(admin, data.user.id);
      }
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      role = profile?.role === "employer" ? "employer" : "employee";
      if (role === "employer") {
        const admin = createAdminClient();
        if (admin) {
          await getOrCreateWorkspaceForOwner(admin, data.user.id);
        }
      }
    }

    return NextResponse.json({ ok: true, role });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
