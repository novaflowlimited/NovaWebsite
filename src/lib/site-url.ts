/** Canonical public origin (no trailing slash). */
export function getSiteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://novaflow.co.ke").replace(/\/$/, "");
}
