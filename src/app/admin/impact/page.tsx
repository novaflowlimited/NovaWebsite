"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse, CommunityStory, ImpactStat } from "@/types";

export default function AdminImpactPage() {
  const [tab, setTab] = useState<"stats" | "stories">("stats");
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [statsRes, stRes] = await Promise.all([
          fetch("/api/impact/stats").then((r) => r.json() as Promise<ApiListResponse<ImpactStat>>),
          apiFetch<ApiListResponse<CommunityStory>>("/api/impact/stories/admin/all"),
        ]);
        setStats(statsRes.data);
        setStories(stRes.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function deleteStat(id: string) {
    if (!confirm("Delete stat?")) return;
    await apiFetch(`/api/impact/stats/${id}`, { method: "DELETE" });
    const statsRes = await fetch("/api/impact/stats").then((r) => r.json() as Promise<ApiListResponse<ImpactStat>>);
    setStats(statsRes.data);
  }

  async function deleteStory(id: string) {
    if (!confirm("Delete story?")) return;
    await apiFetch(`/api/impact/stories/${id}`, { method: "DELETE" });
    const stRes = await apiFetch<ApiListResponse<CommunityStory>>("/api/impact/stories/admin/all");
    setStories(stRes.data);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Impact</h1>
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "stats" ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
          }`}
          onClick={() => setTab("stats")}
        >
          Stats
        </button>
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "stories" ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
          }`}
          onClick={() => setTab("stories")}
        >
          Stories
        </button>
      </div>
      <Link href="/admin/impact/map" className="inline-block text-sm font-semibold text-orange hover:underline">
        Kenya map — featured county →
      </Link>
      <p className="text-sm text-navy/70">
        Homepage number strip (schools, uptime, etc.): edit each stat below. Partner and trusted-org logos:{" "}
        <Link href="/admin/client-logos" className="font-semibold text-orange hover:underline">
          Client logos
        </Link>
        . Intro line above that row:{" "}
        <Link href="/admin/site-settings" className="font-semibold text-orange hover:underline">
          Site settings
        </Link>{" "}
        → Homepage: impact stats &amp; partner logos.
      </p>

      {tab === "stats" ? (
        <div className="space-y-4">
          <Link href="/admin/impact/stats/new">
            <Button>New stat</Button>
          </Link>
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-navy/10 bg-cream/50 text-xs uppercase text-navy/60">
                <tr>
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.id} className="border-b border-navy/5">
                    <td className="px-4 py-3">{s.label}</td>
                    <td className="px-4 py-3">{s.value}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/impact/stats/${s.id}/edit`} className="text-orange hover:underline">
                        Edit
                      </Link>
                      <button type="button" className="ml-3 text-red-600 hover:underline" onClick={() => deleteStat(s.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Link href="/admin/impact/stories/new">
            <Button>New story</Button>
          </Link>
          <p className="text-sm text-navy/70">
            Each story can have a <span className="font-semibold text-navy">cover image</span> (cards on{" "}
            <Link href="/impact" className="text-orange hover:underline">
              /impact
            </Link>{" "}
            and the story page). Open <span className="font-semibold text-navy">Edit</span> → upload under Cover
            image.
          </p>
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-navy/10 bg-cream/50 text-xs uppercase text-navy/60">
                <tr>
                  <th className="px-4 py-3">Cover</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">County</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((s) => (
                  <tr key={s.id} className="border-b border-navy/5">
                    <td className="px-4 py-3 align-middle">
                      {s.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin-only preview; URLs may be outside next/image allowlist
                        <img
                          src={s.coverImage}
                          alt=""
                          className="h-11 w-[4.5rem] rounded-md border border-navy/10 object-cover"
                        />
                      ) : (
                        <span className="text-xs text-navy/45">No cover</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">{s.title}</td>
                    <td className="px-4 py-3">{s.county}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/impact/stories/${s.id}/edit`} className="text-orange hover:underline">
                        Edit
                      </Link>
                      <button type="button" className="ml-3 text-red-600 hover:underline" onClick={() => deleteStory(s.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
