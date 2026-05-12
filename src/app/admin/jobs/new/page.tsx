"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api-client";
import { slugifyTitle } from "@/lib/admin/upload";
import type { JobType } from "@/types";

const types: JobType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];

export default function AdminJobNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slugOverride, setSlugOverride] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Nairobi");
  const [type, setType] = useState<JobType>("FULL_TIME");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [salary, setSalary] = useState("");
  const [published, setPublished] = useState(true);
  const [closingDate, setClosingDate] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">New job</h1>
        <Link href="/admin/jobs" className="text-sm text-orange hover:underline">
          Back
        </Link>
      </div>
      <Card>
        <div className="space-y-4">
          <Input label="Title" value={title} onChange={setTitle} />
          <Input label="Slug override" value={slugOverride} onChange={setSlugOverride} placeholder={slugifyTitle(title)} />
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
          <Input label="Salary (optional)" value={salary} onChange={setSalary} />
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
                await apiFetch("/api/jobs", {
                  method: "POST",
                  body: JSON.stringify({
                    title,
                    slug: slugOverride.trim() || slugifyTitle(title),
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
            {saving ? "Saving…" : "Create"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      <input
        className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
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
