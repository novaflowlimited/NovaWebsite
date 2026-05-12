import { getStoredToken } from "@/lib/api-client";

/** Upload a file to R2 (when configured) via POST /api/upload; otherwise receives dev placeholder URL. */
export async function uploadViaPresign(file: File): Promise<string> {
  const token = getStoredToken();
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Upload failed (${res.status})`);
  }
  const data = (await res.json()) as { publicUrl: string };
  return data.publicUrl;
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
