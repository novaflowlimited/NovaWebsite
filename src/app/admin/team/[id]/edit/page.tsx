"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import { uploadViaPresign } from "@/lib/admin/upload";
import type { ApiItemResponse, TeamMember } from "@/types";

export default function AdminTeamEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [photo, setPhoto] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiFetch<ApiItemResponse<TeamMember>>(`/api/team/admin/${id}`);
      if (cancelled) return;
      const m = res.data;
      setName(m.name);
      setRole(m.role);
      setBio(m.bio);
      setEmail(m.email ?? "");
      setLinkedin(m.linkedin ?? "");
      setTwitter(m.twitter ?? "");
      setSortOrder(m.sortOrder);
      setPhoto(m.photo ?? "");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

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
        <h1 className="text-2xl font-bold text-navy">Edit team member</h1>
        <Link href="/admin/team" className="text-sm text-orange hover:underline">
          Back
        </Link>
      </div>
      <Card>
        <div className="space-y-3">
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Role" value={role} onChange={setRole} />
          <div>
            <label className="text-sm font-medium text-navy">Bio</label>
            <textarea className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="LinkedIn URL" value={linkedin} onChange={setLinkedin} />
          <Field label="Twitter URL" value={twitter} onChange={setTwitter} />
          <div>
            <label className="text-sm font-medium text-navy">Photo</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setPhoto(await uploadViaPresign(f));
              }}
            />
            {photo ? <p className="mt-1 truncate text-xs text-navy/60">{photo}</p> : null}
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Sort order</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>
          <Button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await apiFetch(`/api/team/${id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    name,
                    role,
                    bio,
                    email: email || null,
                    linkedin: linkedin || null,
                    twitter: twitter || null,
                    photo: photo || null,
                    sortOrder,
                  }),
                });
                router.push("/admin/team");
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

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      <input className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
