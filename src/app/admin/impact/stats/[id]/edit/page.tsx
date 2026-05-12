"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse, ImpactStat } from "@/types";

export default function AdminImpactStatEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState(0);
  const [icon, setIcon] = useState("activity");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const [found, setFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/impact/stats").then((r) => r.json() as Promise<ApiListResponse<ImpactStat>>);
        const row = res.data.find((x) => x.id === id);
        if (!cancelled && row) {
          setLabel(row.label);
          setValue(row.value);
          setIcon(row.icon);
          setSortOrder(row.sortOrder);
          setFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!found) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-navy">Stat not found</h1>
        <Link href="/admin/impact" className="text-sm text-orange hover:underline">
          Back to Impact
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Edit impact stat</h1>
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
                await apiFetch(`/api/impact/stats/${id}`, {
                  method: "PUT",
                  body: JSON.stringify({ label, value, icon, sortOrder }),
                });
                router.push("/admin/impact");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
