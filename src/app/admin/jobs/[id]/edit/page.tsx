"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import { slugifyTitle } from "@/lib/admin/upload";
import type { ApiItemResponse, JobDto, JobType } from "@/types";

const types: JobType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];

export default function AdminJobEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobType>("FULL_TIME");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [salary, setSalary] = useState("");
  const [published, setPublished] = useState(true);
  const [closingDate, setClosingDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiFetch<ApiItemResponse<JobDto>>(`/api/jobs/admin/${id}`);
      if (cancelled) return;
      const j = res.data;
      setTitle(j.title);
      setSlug(j.slug);
      setDepartment(j.department);
      setLocation(j.location);
      setType(j.type);
      setExperience(j.experience);
      setDescription(j.description);
      setRequirements(j.requirements.length ? j.requirements : [""]);
      setBenefits(j.benefits.length ? j.benefits : [""]);
      setSalary(j.salary ?? "");
      setPublished(j.published);
      setClosingDate(
        j.closingDate ? new Date(j.closingDate as unknown as string).toISOString().slice(0, 10) : "",
      );
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Edit job</h1>
        <Link href="/admin/jobs" className="text-sm text-orange hover:underline">
          Back
        </Link>
      </div>
      <Card>
        <div className="space-y-4">
          <Input label="Title" value={title} onChange={setTitle} />
          <Input label="Slug" value={slug} onChange={setSlug} />
          <Input label="Department" value={department} onChange={setDepartment} />
          <Input label="Location" value={location} onChange={setLocation} />
          <div>
            <label className="text-sm font-medium text-navy">Type</label>
            <select
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as JobType)}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <Input label="Experience" value={experience} onChange={setExperience} />
          <div>
            <label className="text-sm font-medium text-navy">Description</label>
            <textarea className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <ListField label="Requirements" items={requirements} setItems={setRequirements} />
          <ListField label="Benefits" items={benefits} setItems={setBenefits} />
          <Input label="Salary" value={salary} onChange={setSalary} />
          <div>
            <label className="text-sm font-medium text-navy">Closing date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
            />
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
                await apiFetch(`/api/jobs/${id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    title,
                    slug: slug || slugifyTitle(title),
                    department,
                    location,
                    type,
                    experience,
                    description,
                    requirements: requirements.map((r) => r.trim()).filter(Boolean),
                    benefits: benefits.map((b) => b.trim()).filter(Boolean),
                    salary: salary || null,
                    published,
                    closingDate: closingDate || null,
                  }),
                });
                router.push("/admin/jobs");
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

function ListField({
  label,
  items,
  setItems,
}: {
  label: string;
  items: string[];
  setItems: (v: string[]) => void;
}) {
  return (
    <div>
      <div className="flex justify-between">
        <label className="text-sm font-medium text-navy">{label}</label>
        <button type="button" className="text-xs text-orange" onClick={() => setItems([...items, ""])}>
          + Add
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {items.map((it, i) => (
          <input
            key={i}
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
            value={it}
            onChange={(e) => {
              const n = [...items];
              n[i] = e.target.value;
              setItems(n);
            }}
          />
        ))}
      </div>
    </div>
  );
}
