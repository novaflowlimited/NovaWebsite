"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api-client";
import { uploadViaPresign } from "@/lib/admin/upload";

export default function AdminTestimonialNewPage() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [companyLogo, setCompanyLogo] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">New testimonial</h1>
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
            <label className="text-sm font-medium text-navy">Rating (1-5)</label>
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
                await apiFetch("/api/testimonials", {
                  method: "POST",
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
            {saving ? "Saving…" : "Create"}
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
