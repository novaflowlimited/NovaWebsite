import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { mergeSiteSettingsPayload } from "@/lib/site-settings-merge";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

async function loadSiteSettings(): Promise<SiteSettingsPayload> {
  let stored: unknown = {};
  const delegate = (prisma as unknown as { siteSettings?: { findUnique: (args: unknown) => Promise<unknown> } })
    .siteSettings;
  if (typeof delegate?.findUnique === "function") {
    try {
      const row = (await delegate.findUnique({ where: { id: "default" } })) as {
        payload: string;
      } | null;
      if (row?.payload) {
        try {
          stored = JSON.parse(row.payload) as unknown;
        } catch {
          stored = {};
        }
      }
    } catch {
      stored = {};
    }
  }
  return mergeSiteSettingsPayload(stored);
}

const cachedSiteSettings = unstable_cache(loadSiteSettings, ["site-settings-v1"], {
  tags: ["site-settings"],
});

/** Merged site copy + nav/footer (CMS). Tagged for `revalidateTag("site-settings")` after admin saves. */
export const getSiteSettings = cache(cachedSiteSettings);
