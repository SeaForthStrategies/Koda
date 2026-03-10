import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateTeamCode } from "@/lib/workspace";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const companyName = typeof body?.companyName === "string" ? body.companyName.trim() : "";
    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required." },
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

    const { data: company, error: insertError } = await supabase
      .from("companies")
      .insert({
        name: companyName,
        owner_id: user.id,
        team_code: generateTeamCode(),
      })
      .select("id")
      .maybeSingle();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message ?? "Failed to create company." },
        { status: 500 }
      );
    }
    if (!company) {
      return NextResponse.json(
        { error: "Failed to create company." },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        company_id: company.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message ?? "Failed to link company to profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
