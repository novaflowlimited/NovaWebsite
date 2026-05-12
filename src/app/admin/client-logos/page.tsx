"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import { uploadViaPresign } from "@/lib/admin/upload";
import type { ApiItemResponse, ApiListResponse, ClientLogo, LogoStripKind } from "@/types";

const STRIP_TABS: { id: LogoStripKind; label: string; hint: string }[] = [
  { id: "TRUSTED_BY", label: "Trusted partners", hint: "Mission / impact partners (homepage + services)" },
  { id: "SOFTWARE_CUSTOMERS", label: "Software customers", hint: "Organizations using your software (homepage)" },
];

export default function AdminClientLogosPage() {
  const [stripKind, setStripKind] = useState<LogoStripKind>("TRUSTED_BY");
  const [rows, setRows] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await apiFetch<ApiListResponse<ClientLogo>>(`/api/client-logos/admin/all?strip=${stripKind}`);
    setRows(res.data);
  }, [stripKind]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  async function createLogo(usePlaceholder: boolean) {
    if (!name.trim()) {
      setMsg("Enter a name first.");
      return;
    }
    setMsg(null);
    let logoUrl = "";
    if (!usePlaceholder && pendingFile) logoUrl = await uploadViaPresign(pendingFile);
    if (!logoUrl && usePlaceholder) {
      logoUrl = `https://picsum.photos/seed/${encodeURIComponent(name.trim())}/200/60`;
    }
    if (!logoUrl) {
      setMsg("Choose an image file, or use placeholder.");
      return;
    }
    await apiFetch<ApiItemResponse<ClientLogo>>("/api/client-logos", {
      method: "POST",
      body: JSON.stringify({ name: name.trim(), logoUrl, sortOrder, stripKind }),
    });
    setName("");
    setSortOrder(0);
    setPendingFile(null);
    await load();
    setMsg("Added.");
  }

  async function saveRow(
    row: ClientLogo,
    next: Partial<Pick<ClientLogo, "name" | "logoUrl" | "sortOrder" | "stripKind">>,
  ) {
    await apiFetch(`/api/client-logos/${row.id}`, {
      method: "PUT",
      body: JSON.stringify(next),
    });
    await load();
    setMsg("Saved.");
  }

  async function replaceImage(row: ClientLogo, file: File | null) {
    if (!file) return;
    const logoUrl = await uploadViaPresign(file);
    await saveRow(row, { logoUrl });
  }

  async function remove(id: string) {
    if (!confirm("Delete this logo?")) return;
    await apiFetch(`/api/client-logos/${id}`, { method: "DELETE" });
    await load();
    setMsg("Deleted.");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Client logos</h1>
        <Link href="/admin/dashboard" className="text-sm text-orange hover:underline">
          Dashboard
        </Link>
      </div>
      <p className="text-sm text-navy/70">
        Two homepage rows: trusted partners (under impact stats) and software customers (below that). Eyebrow copy
        for each row is in{" "}
        <Link href="/admin/site-settings" className="font-semibold text-orange hover:underline">
          Site settings
        </Link>
        . The software-customer row stays hidden on the site until you add at least one logo in that tab.
      </p>
      {msg ? <p className="text-sm text-emerald-800">{msg}</p> : null}

      <div className="flex flex-wrap gap-2">
        {STRIP_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              stripKind === t.id ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
            }`}
            onClick={() => {
              setStripKind(t.id);
              setMsg(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-navy/55">{STRIP_TABS.find((t) => t.id === stripKind)?.hint}</p>

      <Card>
        <h2 className="text-lg font-bold text-navy">Add logo ({stripKind === "TRUSTED_BY" ? "trusted" : "software"})</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-navy">Organization name</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Safaricom"
            />
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
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="text-sm font-medium text-navy">Image file</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block text-sm"
              onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button type="button" onClick={() => void createLogo(false)}>
            Create with upload
          </Button>
          <Button type="button" variant="secondary" onClick={() => void createLogo(true)}>
            Create with placeholder image
          </Button>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy/10 bg-cream/50 text-xs uppercase text-navy/60">
            <tr>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Row</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Replace</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <LogoRow key={row.id} row={row} onSave={saveRow} onReplace={replaceImage} onDelete={remove} />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function LogoRow({
  row,
  onSave,
  onReplace,
  onDelete,
}: {
  row: ClientLogo;
  onSave: (
    row: ClientLogo,
    next: Partial<Pick<ClientLogo, "name" | "logoUrl" | "sortOrder" | "stripKind">>,
  ) => Promise<void>;
  onReplace: (row: ClientLogo, file: File | null) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [name, setName] = useState(row.name);
  const [order, setOrder] = useState(row.sortOrder);
  const [strip, setStrip] = useState<LogoStripKind>(row.stripKind);

  useEffect(() => {
    setName(row.name);
    setOrder(row.sortOrder);
    setStrip(row.stripKind);
  }, [row.name, row.sortOrder, row.stripKind]);

  return (
    <tr className="border-b border-navy/5">
      <td className="px-4 py-3">
        <div className="relative h-10 w-28">
          {row.logoUrl ? (
            <Image src={row.logoUrl} alt="" fill className="object-contain object-left" sizes="112px" />
          ) : (
            <span className="text-xs text-navy/50">No image</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <input
          className="w-full min-w-[8rem] rounded border border-navy/15 px-2 py-1 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </td>
      <td className="px-4 py-3">
        <select
          className="max-w-[11rem] rounded border border-navy/15 px-2 py-1 text-xs"
          value={strip}
          onChange={(e) => setStrip(e.target.value as LogoStripKind)}
        >
          <option value="TRUSTED_BY">Trusted partners</option>
          <option value="SOFTWARE_CUSTOMERS">Software customers</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          className="w-20 rounded border border-navy/15 px-2 py-1 text-sm"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="file"
          accept="image/*"
          className="max-w-[140px] text-xs"
          onChange={(e) => void onReplace(row, e.target.files?.[0] ?? null)}
        />
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          className="text-orange hover:underline"
          onClick={() => void onSave(row, { name, sortOrder: order, stripKind: strip })}
        >
          Save
        </button>
        <button type="button" className="ml-3 text-red-600 hover:underline" onClick={() => void onDelete(row.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
