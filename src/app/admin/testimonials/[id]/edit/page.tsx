"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import { uploadViaPresign } from "@/lib/admin/upload";
import type { ApiItemResponse, Testimonial } from "@/types";

export default function AdminTestimonialEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [companyLogo, setCompanyLogo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiFetch<ApiItemResponse<Testimonial>>(`/api/testimonials/admin/${id}`);
      if (cancelled) return;
      const t = res.data;
      setClientName(t.clientName);
      setClientRole(t.clientRole);
      setCompany(t.company);
      setContent(t.content);
      setRating(t.rating);
      setFeatured(t.featured);
      setPublished(t.published);
      setCompanyLogo(t.companyLogo ?? "");
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
        <h1 className="text-2xl font-bold text-navy">Edit testimonial</h1>
        <Link href="/admin/testimonials" className="text-sm text-orange hover:underline">
          Back
        </Link>
      </div>
      <Card>
        <div className="space-y-3">
          <Input label="Client name" value={clientName} onChange={setClientName} />
          <Input label="Role" value={clientRole} onChange={setClientRole} />
          <Input label="Company" value={company} onChange={setCompany} />
          <div>
            <label className="text-sm font-medium text-navy">Quote</label>
            <textarea className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Company logo</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setCompanyLogo(await uploadViaPresign(f));
              }}
            />
            {companyLogo ? <p className="truncate text-xs text-navy/60">{companyLogo}</p> : null}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
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
                await apiFetch(`/api/testimonials/${id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    clientName,
                    clientRole,
                    company,
                    content,
                    rating,
                    featured,
                    published,
                    companyLogo: companyLogo || null,
                  }),
                });
                router.push("/admin/testimonials");
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

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      <input className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
