"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api-client";

export default function AdminImpactStatNewPage() {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [value, setValue] = useState(0);
  const [icon, setIcon] = useState("activity");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">New impact stat</h1>
        <Link href="/admin/impact" className="text-sm text-orange hover:underline">
          Back
        </Link>
      </div>
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy">Label</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Value</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Icon key</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Sort order</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>
          <Button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await apiFetch("/api/impact/stats", {
                  method: "POST",
                  body: JSON.stringify({ label, value, icon, sortOrder }),
                });
                router.push("/admin/impact");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving…" : "Create"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
