"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse, CommunityStory, JobDto, PostDto, ServiceDto } from "@/types";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [jobs, setJobs] = useState<JobDto[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, s, st, j] = await Promise.all([
          apiFetch<ApiListResponse<PostDto>>("/api/posts/admin/all"),
          apiFetch<ApiListResponse<ServiceDto>>("/api/services/admin/all"),
          apiFetch<ApiListResponse<CommunityStory>>("/api/impact/stories/admin/all"),
          apiFetch<ApiListResponse<JobDto>>("/api/jobs/admin/all"),
        ]);
        if (!cancelled) {
          setPosts(p.data);
          setServices(s.data);
          setStories(st.data);
          setJobs(j.data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  const recent = [
    ...posts.map((x) => ({ t: "Post", title: x.title, href: `/admin/posts/${x.id}/edit`, at: x.updatedAt })),
    ...stories.map((x) => ({
      t: "Story",
      title: x.title,
      href: `/admin/impact/stories/${x.id}/edit`,
      at: x.updatedAt,
    })),
    ...jobs.map((x) => ({ t: "Job", title: x.title, href: `/admin/jobs/${x.id}/edit`, at: x.updatedAt })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <p className="text-sm text-navy/60">Posts</p>
          <p className="text-3xl font-bold text-navy">{posts.length}</p>
          <Link href="/admin/posts" className="mt-2 inline-block text-sm text-orange hover:underline">
            Manage
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-navy/60">Services</p>
          <p className="text-3xl font-bold text-navy">{services.length}</p>
          <Link href="/admin/services" className="mt-2 inline-block text-sm text-orange hover:underline">
            Manage
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-navy/60">Impact stories</p>
          <p className="text-3xl font-bold text-navy">{stories.length}</p>
          <Link href="/admin/impact" className="mt-2 inline-block text-sm text-orange hover:underline">
            Manage
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-navy/60">Jobs</p>
          <p className="text-3xl font-bold text-navy">{jobs.filter((j) => j.published).length}</p>
          <p className="text-xs text-navy/50">open / published</p>
          <Link href="/admin/jobs" className="mt-2 inline-block text-sm text-orange hover:underline">
            Manage
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-navy/60">Homepage</p>
          <p className="text-sm font-medium text-navy">Stats &amp; partners</p>
          <Link href="/admin/impact" className="mt-2 inline-block text-sm text-orange hover:underline">
            Impact stats
          </Link>
          <Link href="/admin/client-logos" className="mt-1 block text-sm text-orange hover:underline">
            Client logos
          </Link>
          <Link href="/admin/site-settings" className="mt-1 block text-sm text-orange hover:underline">
            Site settings
          </Link>
        </Card>
      </div>
      <Card>
        <h2 className="font-bold text-navy">Recent activity</h2>
        <ul className="mt-4 divide-y divide-navy/10">
          {recent.map((r) => (
            <li key={`${r.t}-${r.title}`} className="flex items-center justify-between py-2 text-sm">
              <Link href={r.href} className="font-medium text-navy hover:text-orange">
                <span className="text-navy/50">{r.t}:</span> {r.title}
              </Link>
              <span className="text-xs text-navy/45">{new Date(r.at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
