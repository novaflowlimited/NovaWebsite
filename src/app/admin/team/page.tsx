"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse, TeamMember } from "@/types";

export default function AdminTeamPage() {
  const [rows, setRows] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch<ApiListResponse<TeamMember>>("/api/team/admin/all");
        setRows(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete team member?")) return;
    await apiFetch(`/api/team/${id}`, { method: "DELETE" });
    const res = await apiFetch<ApiListResponse<TeamMember>>("/api/team/admin/all");
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
        <h1 className="text-2xl font-bold text-navy">Team</h1>
        <Link href="/admin/team/new">
          <Button>New member</Button>
        </Link>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy/10 bg-cream/50 text-xs uppercase text-navy/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-navy/5">
                <td className="px-4 py-3 font-medium text-navy">{m.name}</td>
                <td className="px-4 py-3">{m.role}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/team/${m.id}/edit`} className="text-orange hover:underline">
                    Edit
                  </Link>
                  <button type="button" className="ml-3 text-red-600 hover:underline" onClick={() => remove(m.id)}>
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
