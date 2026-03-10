import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const admin = createAdminClient();
  if (!supabase || !admin) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "employer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: workspace } = await admin
    .from("workspaces")
    .select("id, join_code, name")
    .eq("owner_id", user.id)
    .limit(1)
    .single();

  if (!workspace) {
    return NextResponse.json({ joinCode: null, name: null });
  }

  return NextResponse.json({
    joinCode: workspace.join_code,
    name: workspace.name ?? undefined,
  });
}
