"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api-client";
import { uploadViaPresign } from "@/lib/admin/upload";
import type { StoryCategory } from "@/types";

const cats: StoryCategory[] = ["SCHOOLS", "DISPENSARIES", "POLICE_STATIONS", "COMMUNITY_CENTERS", "OTHER"];

export default function AdminImpactStoryNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [county, setCounty] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [category, setCategory] = useState<StoryCategory>("OTHER");
  const [published, setPublished] = useState(true);
  const [coverImage, setCoverImage] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">New impact story</h1>
        <Link href="/admin/impact" className="text-sm text-orange hover:underline">
          Back
        </Link>
      </div>
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy">Title</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-navy">Location</label>
              <input
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy">County</label>
              <input
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Beneficiary</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Category</label>
            <select
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value as StoryCategory)}
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Excerpt</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Content</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Cover image</label>
            <p className="mt-0.5 text-xs text-navy/55">Optional. Shown on /impact cards and the story page header.</p>
            {coverImage ? (
              <div className="relative mt-2 aspect-[16/9] max-h-52 w-full max-w-md overflow-hidden rounded-lg border border-navy/10 bg-navy/5">
                {/* eslint-disable-next-line @next/next/no-img-element -- preview URL may be any host */}
                <img src={coverImage} alt="" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setCoverImage(await uploadViaPresign(f));
              }}
            />
            {coverImage ? <p className="mt-1 truncate text-xs text-navy/60">{coverImage}</p> : null}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published
          </label>
          <Button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await apiFetch("/api/impact/stories", {
                  method: "POST",
                  body: JSON.stringify({
                    title,
                    location,
                    county,
                    excerpt,
                    content,
                    beneficiary,
                    category,
                    published,
                    coverImage: coverImage || null,
                  }),
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
