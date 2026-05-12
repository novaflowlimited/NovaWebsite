import { ApiError } from "./api-error";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("novaflow_admin_token");
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("novaflow_admin_token", token);
  else localStorage.removeItem("novaflow_admin_token");
}

function resolveApiUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const pathPart = path.startsWith("/") ? path : `/${path}`;
  // In the browser, always use a same-origin relative URL so opening the site as
  // 127.0.0.1 vs localhost (or different ports) cannot break admin fetches.
  if (typeof window !== "undefined") {
    return pathPart;
  }
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${pathPart}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = resolveApiUrl(path);
  const token = getStoredToken();
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (res.status === 401) {
    setStoredToken(null);
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
      window.location.href = "/admin/login";
    }
  }
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(`Request failed: ${res.status}`, res.status, body);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
