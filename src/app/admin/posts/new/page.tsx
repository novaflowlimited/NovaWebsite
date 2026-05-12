"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api-client";
import { slugifyTitle, uploadViaPresign } from "@/lib/admin/upload";

export default function AdminPostNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slugOverride, setSlugOverride] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Impact");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">New post</h1>
        <Link href="/admin/posts" className="text-sm text-orange hover:underline">
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
          <div>
            <label className="text-sm font-medium text-navy">Slug (optional override)</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={slugOverride}
              onChange={(e) => setSlugOverride(e.target.value)}
              placeholder={slugifyTitle(title) || "auto-from-title"}
            />
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
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Cover image</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await uploadViaPresign(f);
                setCoverImage(url);
              }}
            />
            {coverImage ? (
              <p className="mt-1 truncate text-xs text-navy/60">
                {coverImage}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-navy">Category</label>
              <input
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy">Tags (comma)</label>
              <input
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
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
                await apiFetch("/api/posts", {
                  method: "POST",
                  body: JSON.stringify({
                    title,
                    slug: slugOverride.trim() || slugifyTitle(title),
                    excerpt,
                    content,
                    coverImage: coverImage || null,
                    category,
                    tags: tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                    published,
                  }),
                });
                router.push("/admin/posts");
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
