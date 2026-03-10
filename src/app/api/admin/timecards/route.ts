import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type TimecardRow = {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  total_hours: number;
  status: string;
  email?: string;
  full_name?: string;
};

export async function GET(request: Request) {
  const supabase = await createClient();
  const admin = createAdminClient();
  if (!supabase || !admin) {
    return NextResponse.json(
      { error: "Auth or admin not configured." },
      { status: 503 }
    );
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
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .single();
  if (!workspace) {
    return NextResponse.json({ timecards: [] });
  }

  const { data: members } = await admin
    .from("profiles")
    .select("id")
    .eq("workspace_id", workspace.id);
  const memberIds = (members ?? []).map((m) => m.id);
  if (memberIds.length === 0) {
    return NextResponse.json({ timecards: [] });
  }

  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const from = fromParam ? (fromParam.includes("T") ? fromParam : `${fromParam}T00:00:00.000Z`) : null;
  const to = toParam ? (toParam.includes("T") ? toParam : `${toParam}T23:59:59.999Z`) : null;

  let query = admin
    .from("timecards")
    .select("id, user_id, check_in, check_out, total_hours, status")
    .in("user_id", memberIds)
    .order("check_in", { ascending: false });

  if (from) query = query.gte("check_in", from);
  if (to) query = query.lte("check_in", to);

  const { data: timecards, error: tcError } = await query;
  if (tcError) {
    return NextResponse.json({ error: tcError.message }, { status: 500 });
  }

  const userIds = [...new Set((timecards ?? []).map((t) => t.user_id))];
  const { data: profiles } = await admin.from("profiles").select("id, email, full_name").in("id", userIds);
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const rows: TimecardRow[] = (timecards ?? []).map((t) => ({
    ...t,
    email: profileMap.get(t.user_id)?.email,
    full_name: profileMap.get(t.user_id)?.full_name ?? undefined,
  }));

  return NextResponse.json({ timecards: rows });
}
