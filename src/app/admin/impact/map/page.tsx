"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import type { ApiItemResponse, MapFeaturedCounty } from "@/types";

export default function AdminImpactMapPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [countyName, setCountyName] = useState("");
  const [statusLabel, setStatusLabel] = useState("Connected");
  const [description, setDescription] = useState("");
  const [schoolsCount, setSchoolsCount] = useState(0);
  const [dispensariesCount, setDispensariesCount] = useState(0);
  const [communityHotspots, setCommunityHotspots] = useState(0);

  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch<ApiItemResponse<MapFeaturedCounty | null>>("/api/impact/map-feature/admin");
        const d = res.data;
        if (d) {
          setCountyName(d.countyName);
          setStatusLabel(d.statusLabel);
          setDescription(d.description);
          setSchoolsCount(d.schoolsCount);
          setDispensariesCount(d.dispensariesCount);
          setCommunityHotspots(d.communityHotspots);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Impact map — featured county</h1>
        <Link href="/admin/impact" className="text-sm text-orange hover:underline">
          Back
        </Link>
      </div>
      <p className="text-sm text-navy/70">
        This appears on the public <strong>Impact</strong> page next to the Kenya map. Edit the county name,
        status pill, description, and counts.
      </p>
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy">County name</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={countyName}
              onChange={(e) => setCountyName(e.target.value)}
              placeholder="e.g. Nakuru County"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Status label</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={statusLabel}
              onChange={(e) => setStatusLabel(e.target.value)}
              placeholder="Connected"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Description</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-navy">Schools</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                value={schoolsCount}
                onChange={(e) => setSchoolsCount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy">Dispensaries</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                value={dispensariesCount}
                onChange={(e) => setDispensariesCount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy">Hotspots</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                value={communityHotspots}
                onChange={(e) => setCommunityHotspots(Number(e.target.value))}
              />
            </div>
          </div>
          <Button
            type="button"
            disabled={saving || !countyName.trim() || !description.trim()}
            onClick={async () => {
              setSaving(true);
              try {
                await apiFetch("/api/impact/map-feature", {
                  method: "PUT",
                  body: JSON.stringify({
                    countyName: countyName.trim(),
                    statusLabel: statusLabel.trim(),
                    description: description.trim(),
                    schoolsCount,
                    dispensariesCount,
                    communityHotspots,
                  }),
                });
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
