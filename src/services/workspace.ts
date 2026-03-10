import type { SupabaseClient } from "@supabase/supabase-js";
import { generateJoinCode } from "@/lib/workspace";

export type WorkspaceRow = {
  id: string;
  owner_id: string;
  join_code: string;
  name: string | null;
  created_at: string;
  updated_at: string;
};

/** Get existing workspace for owner, or create one with a unique join code. */
export async function getOrCreateWorkspaceForOwner(
  admin: SupabaseClient,
  ownerId: string
): Promise<WorkspaceRow | null> {
  const { data: existing } = await admin
    .from("workspaces")
    .select("id, owner_id, join_code, name, created_at, updated_at")
    .eq("owner_id", ownerId)
    .limit(1)
    .single();

  if (existing) return existing as WorkspaceRow;

  for (let attempt = 0; attempt < 10; attempt++) {
    const join_code = generateJoinCode();
    const { data: inserted, error } = await admin.from("workspaces").insert({
      owner_id: ownerId,
      join_code,
      name: null,
      updated_at: new Date().toISOString(),
    }).select("id, owner_id, join_code, name, created_at, updated_at").single();

    if (!error && inserted) return inserted as WorkspaceRow;
    if (error?.code !== "23505") return null; // not unique conflict, bail
  }
  return null;
}
