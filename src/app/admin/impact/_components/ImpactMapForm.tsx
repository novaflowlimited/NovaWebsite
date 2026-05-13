"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import type { ApiItemResponse, MapFeaturedCounty } from "@/types";

type Props = {
  /** When false, skip outer Card (e.g. nested inside another Card). */
  withCard?: boolean;
};

export function ImpactMapForm({ withCard = true }: Props) {
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
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const inner = (
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
        <p className="mt-1 text-xs text-navy/55">Shown as the small pill above the county name (Connected / In Progress / Planned).</p>
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
  );

  if (!withCard) return inner;
  return <Card>{inner}</Card>;
}
