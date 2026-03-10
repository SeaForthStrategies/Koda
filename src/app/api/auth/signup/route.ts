import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeJoinCode } from "@/lib/workspace";
import { signupSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const { email, password, firstName, lastName, website, joinCode } = parsed.data;
    if (website && website.length > 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Auth not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local." },
        { status: 503 }
      );
    }
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, first_name: firstName.trim(), last_name: lastName.trim() },
      },
    });
    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Sign up failed" },
        { status: 400 }
      );
    }
    if (!data.user) {
      return NextResponse.json({ error: "Sign up failed" }, { status: 400 });
    }

    const code = typeof joinCode === "string" ? joinCode.trim() : "";
    if (code.length === 6) {
      const admin = createAdminClient();
      if (admin) {
        const normalized = normalizeJoinCode(code);
        const { data: workspace } = await admin
          .from("workspaces")
          .select("id")
          .eq("join_code", normalized)
          .single();
        if (workspace) {
          await admin
            .from("profiles")
            .update({
              workspace_id: workspace.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", data.user.id);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: data.user.identities?.length
        ? "Check your email to confirm your account."
        : "Account created.",
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
