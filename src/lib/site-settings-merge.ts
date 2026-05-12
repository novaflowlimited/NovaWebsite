import type { SiteSettingsPayload } from "./site-settings-payload";
import { DEFAULT_SITE_SETTINGS } from "./site-settings-payload";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge `stored` over `defaults`. Arrays replace entirely when `stored` provides a non-empty array. */
export function mergeSiteSettingsPayload(stored: unknown): SiteSettingsPayload {
  return merge(DEFAULT_SITE_SETTINGS, stored) as SiteSettingsPayload;
}

function merge<T>(defaults: T, stored: unknown): T {
  if (stored === null || stored === undefined) return defaults;
  if (Array.isArray(defaults)) {
    if (Array.isArray(stored) && stored.length > 0) return stored as T;
    return defaults;
  }
  if (isPlainObject(defaults)) {
    if (!isPlainObject(stored)) return defaults;
    const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
    for (const key of Object.keys(defaults as object)) {
      out[key] = merge((defaults as Record<string, unknown>)[key], stored[key]);
    }
    return out as T;
  }
  if (typeof stored === typeof defaults && (typeof stored !== "object" || stored === null)) {
    return (stored as T) ?? defaults;
  }
  return defaults;
}
