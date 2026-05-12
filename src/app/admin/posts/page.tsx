"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse, PostDto } from "@/types";

export default function AdminPostsPage() {
  const [rows, setRows] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch<ApiListResponse<PostDto>>("/api/posts/admin/all");
        setRows(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    await apiFetch(`/api/posts/${id}`, { method: "DELETE" });
    const res = await apiFetch<ApiListResponse<PostDto>>("/api/posts/admin/all");
    setRows(res.data);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Posts</h1>
        <Link href="/admin/posts/new">
          <Button>New post</Button>
        </Link>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-navy/10 bg-cream/50 text-xs uppercase text-navy/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-navy/5">
                <td className="px-4 py-3 font-medium text-navy">{p.title}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{p.published ? "Published" : "Draft"}</td>
                <td className="px-4 py-3 text-navy/60">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/posts/${p.id}/edit`} className="text-orange hover:underline">
                    Edit
                  </Link>
                  <button type="button" className="ml-3 text-red-600 hover:underline" onClick={() => remove(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
