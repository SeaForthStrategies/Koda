"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WorkspaceJoinCode() {
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/workspace")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: { joinCode?: string | null }) => setJoinCode(data?.joinCode ?? null));
  }, []);

  if (joinCode === null) return null;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(joinCode ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">Team join code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Share this code with employees. When they sign up and enter it, their timecards will appear here.
        </p>
        <div className="flex items-center gap-2">
          <code className="rounded-md border border-border bg-muted/50 px-3 py-2 text-lg font-mono tracking-widest">
            {joinCode}
          </code>
          <Button variant="outline" size="sm" onClick={copyCode}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
