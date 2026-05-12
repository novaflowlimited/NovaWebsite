"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse, ServiceDto } from "@/types";

export default function AdminServicesPage() {
  const [rows, setRows] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch<ApiListResponse<ServiceDto>>("/api/services/admin/all");
        setRows(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this service and its plans?")) return;
    await apiFetch(`/api/services/${id}`, { method: "DELETE" });
    const res = await apiFetch<ApiListResponse<ServiceDto>>("/api/services/admin/all");
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
        <h1 className="text-2xl font-bold text-navy">Services</h1>
        <Link href="/admin/services/new">
          <Button>New service</Button>
        </Link>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-navy/10 bg-cream/50 text-xs uppercase text-navy/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Pricing</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-navy/5">
                <td className="px-4 py-3 font-medium text-navy">{s.name}</td>
                <td className="px-4 py-3">{s.category}</td>
                <td className="px-4 py-3">{s.pricingType}</td>
                <td className="px-4 py-3">{s.published ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/services/${s.id}/edit`} className="text-orange hover:underline">
                    Edit
                  </Link>
                  <button type="button" className="ml-3 text-red-600 hover:underline" onClick={() => remove(s.id)}>
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
