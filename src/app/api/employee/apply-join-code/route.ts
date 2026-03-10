import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeJoinCode } from "@/lib/workspace";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const joinCode = typeof body?.joinCode === "string" ? body.joinCode.trim() : "";
    if (!joinCode) {
      return NextResponse.json(
        { error: "Join code is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (sessionError || !user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 503 }
      );
    }

    const normalized = normalizeJoinCode(joinCode);
    const { data: workspace, error: workspaceError } = await admin
      .from("workspaces")
      .select("id")
      .eq("join_code", normalized)
      .maybeSingle();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: "Invalid invite code. Please check and try again." },
        { status: 400 }
      );
    }

    const { error: updateError } = await admin
      .from("profiles")
      .update({
        workspace_id: workspace.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message ?? "Failed to join company." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
