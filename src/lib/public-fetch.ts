import { headers } from "next/headers";
import { ApiError } from "./api-error";

/** ISR-style window for untagged GETs; prefer `next: { tags: [...] }` + `revalidateTag` after admin writes. */
const DEFAULT_REVALIDATE = 3600;

/** Base URL for server-side fetches to this app's API (avoids localhost vs 127.0.0.1 / port mismatches). */
export async function resolvePublicBaseUrl(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    if (host) {
      return `${proto}://${host}`;
    }
  } catch {
    /* outside request context */
  }
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export async function publicFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } },
): Promise<T> {
  const base = await resolvePublicBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const isGet = (init?.method ?? "GET").toUpperCase() === "GET";
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    next: isGet ? { revalidate: DEFAULT_REVALIDATE, ...init?.next } : { ...init?.next },
  });
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(`Request failed: ${res.status}`, res.status, body);
  }
  return (await res.json()) as T;
}
