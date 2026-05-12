"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse, Testimonial } from "@/types";

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch<ApiListResponse<Testimonial>>("/api/testimonials/admin/all");
        setRows(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete testimonial?")) return;
    await apiFetch(`/api/testimonials/${id}`, { method: "DELETE" });
    const res = await apiFetch<ApiListResponse<Testimonial>>("/api/testimonials/admin/all");
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
        <h1 className="text-2xl font-bold text-navy">Testimonials</h1>
        <Link href="/admin/testimonials/new">
          <Button>New</Button>
        </Link>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy/10 bg-cream/50 text-xs uppercase text-navy/60">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-navy/5">
                <td className="px-4 py-3 font-medium text-navy">{t.clientName}</td>
                <td className="px-4 py-3">{t.company}</td>
                <td className="px-4 py-3">{t.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/testimonials/${t.id}/edit`} className="text-orange hover:underline">
                    Edit
                  </Link>
                  <button type="button" className="ml-3 text-red-600 hover:underline" onClick={() => remove(t.id)}>
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
