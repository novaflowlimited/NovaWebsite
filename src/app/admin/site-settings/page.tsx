"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import { ApiError } from "@/lib/api-error";
import { uploadViaPresign } from "@/lib/admin/upload";
import { DEFAULT_SITE_SETTINGS, type SiteSettingsPayload, type WhyIconKey } from "@/lib/site-settings-payload";
import type { ApiItemResponse } from "@/types";

function parseLinkLines(raw: string): { href: string; label: string }[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const pipe = line.indexOf("|");
      if (pipe === -1) return { label: line, href: "/" };
      return { label: line.slice(0, pipe).trim(), href: line.slice(pipe + 1).trim() };
    })
    .filter((x) => x.label && x.href);
}

function formatLinkLines(links: { href: string; label: string }[]): string {
  return links.map((l) => `${l.label}|${l.href}`).join("\n");
}

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function formatLines(lines: string[]): string {
  return lines.join("\n");
}

function parseSlugs(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const WHY_ICONS: WhyIconKey[] = ["chart", "cpu", "shield", "sparkle"];

export default function AdminSiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [s, setS] = useState<SiteSettingsPayload>(DEFAULT_SITE_SETTINGS);

  const load = useCallback(async () => {
    setErr(null);
    const res = await apiFetch<ApiItemResponse<SiteSettingsPayload>>("/api/site-settings");
    setS(res.data);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        await load();
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  async function save() {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await apiFetch("/api/site-settings", { method: "PUT", body: JSON.stringify({ data: s }) });
      setMsg("Saved. Public pages will pick up changes on next request (tag revalidated).");
      await load();
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        const b = e.body as { issues?: unknown; error?: string } | undefined;
        if (b?.issues) setErr(JSON.stringify(b.issues, null, 2));
        else setErr(b?.error ? `${e.message}: ${b.error}` : e.message);
      } else setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function uploadHero(f: File | null) {
    if (!f) return;
    try {
      const url = await uploadViaPresign(f);
      setS((p) => ({ ...p, hero: { ...p.hero, imageUrl: url } }));
      setMsg("Hero image uploaded.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function uploadMission(f: File | null) {
    if (!f) return;
    try {
      const url = await uploadViaPresign(f);
      setS((p) => ({ ...p, mission: { ...p.mission, imageUrl: url } }));
      setMsg("Mission image uploaded.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function uploadBrandLogo(f: File | null) {
    if (!f) return;
    try {
      const url = await uploadViaPresign(f);
      setS((p) => ({ ...p, brand: { ...p.brand, logoUrl: url } }));
      setMsg("Brand logo uploaded.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function patchImpactImage(
    field: "heroBgUrl" | "partnerCtaBgUrl" | "infrastructurePhotoUrl",
    f: File | null,
  ) {
    if (!f) return;
    try {
      const url = await uploadViaPresign(f);
      setS((p) => ({ ...p, impact: { ...p.impact, [field]: url } }));
      setMsg("Impact image uploaded.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Site settings</h1>
        <Link href="/admin/dashboard" className="text-sm text-orange hover:underline">
          Dashboard
        </Link>
      </div>
      <p className="text-sm text-navy/70">
        Homepage copy, navigation, footer, and hero/mission images. Images upload to Cloudflare R2 when{" "}
        <code className="rounded bg-slate-200 px-1 text-xs">R2_*</code> env vars are set; otherwise a placeholder URL
        is returned.
      </p>

      {msg ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{msg}</p> : null}
      {err ? (
        <pre className="max-h-48 overflow-auto rounded-lg bg-red-50 p-3 text-xs text-red-900">{err}</pre>
      ) : null}

      <Card>
        <h2 className="text-lg font-bold text-navy">Brand logo</h2>
        <p className="mt-1 text-sm text-navy/65">
          Shown in the navbar, footer, and dashboard mockups. Leave the URL empty to keep the “N” mark.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Logo image URL" value={s.brand.logoUrl} onChange={(v) => setS((p) => ({ ...p, brand: { ...p.brand, logoUrl: v } }))} />
          <Field label="Logo alt text" value={s.brand.logoAlt} onChange={(v) => setS((p) => ({ ...p, brand: { ...p.brand, logoAlt: v } }))} />
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium text-navy">Upload logo</label>
          <input type="file" accept="image/*" className="mt-1 block text-sm" onChange={(e) => void uploadBrandLogo(e.target.files?.[0] ?? null)} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Impact page images</h2>
        <p className="mt-1 text-sm text-navy/65">Hero background, partner CTA strip, and infrastructure column photo.</p>
        <div className="mt-4 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Hero background URL" value={s.impact.heroBgUrl} onChange={(v) => setS((p) => ({ ...p, impact: { ...p.impact, heroBgUrl: v } }))} />
            <Field label="Hero background alt" value={s.impact.heroBgAlt} onChange={(v) => setS((p) => ({ ...p, impact: { ...p.impact, heroBgAlt: v } }))} />
          </div>
          <input type="file" accept="image/*" className="block text-sm" onChange={(e) => void patchImpactImage("heroBgUrl", e.target.files?.[0] ?? null)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Partner CTA background URL" value={s.impact.partnerCtaBgUrl} onChange={(v) => setS((p) => ({ ...p, impact: { ...p.impact, partnerCtaBgUrl: v } }))} />
            <Field label="Partner CTA alt" value={s.impact.partnerCtaBgAlt} onChange={(v) => setS((p) => ({ ...p, impact: { ...p.impact, partnerCtaBgAlt: v } }))} />
          </div>
          <input type="file" accept="image/*" className="block text-sm" onChange={(e) => void patchImpactImage("partnerCtaBgUrl", e.target.files?.[0] ?? null)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Infrastructure photo URL" value={s.impact.infrastructurePhotoUrl} onChange={(v) => setS((p) => ({ ...p, impact: { ...p.impact, infrastructurePhotoUrl: v } }))} />
            <Field label="Infrastructure photo alt" value={s.impact.infrastructurePhotoAlt} onChange={(v) => setS((p) => ({ ...p, impact: { ...p.impact, infrastructurePhotoAlt: v } }))} />
          </div>
          <input type="file" accept="image/*" className="block text-sm" onChange={(e) => void patchImpactImage("infrastructurePhotoUrl", e.target.files?.[0] ?? null)} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Brand & navigation</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Company name" value={s.companyName} onChange={(v) => setS((p) => ({ ...p, companyName: v }))} />
          <Field
            label="Copyright entity"
            value={s.copyrightEntity}
            onChange={(v) => setS((p) => ({ ...p, copyrightEntity: v }))}
          />
          <Field label="Navbar tagline" value={s.navbar.tagline} onChange={(v) => setS((p) => ({ ...p, navbar: { ...p.navbar, tagline: v } }))} />
          <Field label="Navbar CTA label" value={s.navbar.ctaLabel} onChange={(v) => setS((p) => ({ ...p, navbar: { ...p.navbar, ctaLabel: v } }))} />
          <Field label="Navbar CTA href" value={s.navbar.ctaHref} onChange={(v) => setS((p) => ({ ...p, navbar: { ...p.navbar, ctaHref: v } }))} />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-navy">Desktop nav (one per line: Label|/path)</label>
          <textarea
            rows={5}
            className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 font-mono text-sm"
            value={formatLinkLines(s.navbar.desktopLinks)}
            onChange={(e) =>
              setS((p) => ({ ...p, navbar: { ...p.navbar, desktopLinks: parseLinkLines(e.target.value) } }))
            }
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-navy">Mobile nav (Label|/path)</label>
          <textarea
            rows={7}
            className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 font-mono text-sm"
            value={formatLinkLines(s.navbar.mobileLinks)}
            onChange={(e) =>
              setS((p) => ({ ...p, navbar: { ...p.navbar, mobileLinks: parseLinkLines(e.target.value) } }))
            }
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Hero</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Badge" value={s.hero.badge} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, badge: v } }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title line 1" value={s.hero.titleLine1} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, titleLine1: v } }))} />
            <Field label="Title line 2" value={s.hero.titleLine2} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, titleLine2: v } }))} />
            <Field label="Title line 3 (orange)" value={s.hero.titleLine3} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, titleLine3: v } }))} />
            <Field label="Title line 4 (orange)" value={s.hero.titleLine4} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, titleLine4: v } }))} />
          </div>
          <Field label="Subtitle" value={s.hero.subtitle} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, subtitle: v } }))} textarea />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary CTA" value={s.hero.primaryCta} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, primaryCta: v } }))} />
            <Field label="Primary href" value={s.hero.primaryHref} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, primaryHref: v } }))} />
            <Field label="Secondary CTA" value={s.hero.secondaryCta} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, secondaryCta: v } }))} />
            <Field label="Secondary href" value={s.hero.secondaryHref} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, secondaryHref: v } }))} />
          </div>
          <Field label="Hero image URL" value={s.hero.imageUrl} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, imageUrl: v } }))} />
          <Field label="Hero image alt" value={s.hero.imageAlt} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, imageAlt: v } }))} />
          <div>
            <label className="text-sm font-medium text-navy">Upload hero image</label>
            <input type="file" accept="image/*" className="mt-1 block text-sm" onChange={(e) => void uploadHero(e.target.files?.[0] ?? null)} />
          </div>
          <Field
            label="Visual sidebar (comma-separated)"
            value={s.hero.visualSidebar.join(", ")}
            onChange={(v) =>
              setS((p) => ({
                ...p,
                hero: { ...p.hero, visualSidebar: v.split(",").map((x) => x.trim()).filter(Boolean) },
              }))
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Revenue label" value={s.hero.revenueLabel} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, revenueLabel: v } }))} />
            <Field label="Revenue value" value={s.hero.revenueValue} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, revenueValue: v } }))} />
            <Field label="Revenue trend label" value={s.hero.revenueTrendLabel} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, revenueTrendLabel: v } }))} />
            <Field label="Revenue badge" value={s.hero.revenueBadge} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, revenueBadge: v } }))} />
            <Field label="AI card eyebrow" value={s.hero.aiCardEyebrow} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, aiCardEyebrow: v } }))} />
            <Field label="AI card title" value={s.hero.aiCardTitle} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, aiCardTitle: v } }))} />
            <Field label="AI card hint" value={s.hero.aiCardHint} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, aiCardHint: v } }))} />
            <Field label="Uptime chip" value={s.hero.uptimeChip} onChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, uptimeChip: v } }))} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Homepage: impact stats &amp; partner logos</h2>
        <p className="mt-1 text-sm text-navy/70">
          The number strip (schools, uptime, …) uses{" "}
          <Link href="/admin/impact" className="font-semibold text-orange hover:underline">
            Impact → Stats
          </Link>
          . Optional title above that row:
        </p>
        <div className="mt-4">
          <Field
            label="Eyebrow above stats row (optional — leave empty to hide)"
            value={s.statsStrip.eyebrow}
            onChange={(v) => setS((p) => ({ ...p, statsStrip: { ...p.statsStrip, eyebrow: v } }))}
          />
        </div>
        <hr className="my-6 border-navy/10" />
        <h3 className="text-sm font-bold text-navy">Trusted partners row (under the stats)</h3>
        <p className="mt-1 text-sm text-navy/70">
          Upload logo images and set order in{" "}
          <Link href="/admin/client-logos" className="font-semibold text-orange hover:underline">
            Client logos
          </Link>
          . If a row has no image URL, the name shows as text.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow above logos" value={s.clientLogos.eyebrow} onChange={(v) => setS((p) => ({ ...p, clientLogos: { ...p.clientLogos, eyebrow: v } }))} />
          <Field
            label="“And more” label"
            value={s.clientLogos.andMoreLabel}
            onChange={(v) => setS((p) => ({ ...p, clientLogos: { ...p.clientLogos, andMoreLabel: v } }))}
          />
        </div>
        <hr className="my-6 border-navy/10" />
        <h3 className="text-sm font-bold text-navy">Software customers row (below trusted partners)</h3>
        <p className="mt-1 text-sm text-navy/70">
          Same admin as above: in Client logos, use the{" "}
          <span className="font-semibold text-navy">Software customers</span> tab. The homepage hides this block until
          at least one logo is in that tab.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Eyebrow above software-customer logos"
            value={s.softwareCustomersLogos.eyebrow}
            onChange={(v) => setS((p) => ({ ...p, softwareCustomersLogos: { ...p.softwareCustomersLogos, eyebrow: v } }))}
          />
          <Field
            label="“And more” label (software row)"
            value={s.softwareCustomersLogos.andMoreLabel}
            onChange={(v) => setS((p) => ({ ...p, softwareCustomersLogos: { ...p.softwareCustomersLogos, andMoreLabel: v } }))}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Products ecosystem row</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Eyebrow" value={s.ecosystem.eyebrow} onChange={(v) => setS((p) => ({ ...p, ecosystem: { ...p.ecosystem, eyebrow: v } }))} />
          <Field label="Title" value={s.ecosystem.title} onChange={(v) => setS((p) => ({ ...p, ecosystem: { ...p.ecosystem, title: v } }))} />
          <Field label="Subtitle" value={s.ecosystem.subtitle} onChange={(v) => setS((p) => ({ ...p, ecosystem: { ...p.ecosystem, subtitle: v } }))} textarea />
          <Field
            label="Service slugs (comma-separated, order = card order)"
            value={s.ecosystem.slugs.join(", ")}
            onChange={(v) => setS((p) => ({ ...p, ecosystem: { ...p.ecosystem, slugs: parseSlugs(v) } }))}
          />
          <Field
            label="Card link label"
            value={s.ecosystem.learnMoreLabel}
            onChange={(v) => setS((p) => ({ ...p, ecosystem: { ...p.ecosystem, learnMoreLabel: v } }))}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Mission / impact teaser</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Eyebrow" value={s.mission.eyebrow} onChange={(v) => setS((p) => ({ ...p, mission: { ...p.mission, eyebrow: v } }))} />
          <Field label="Title" value={s.mission.title} onChange={(v) => setS((p) => ({ ...p, mission: { ...p.mission, title: v } }))} />
          <Field label="Body" value={s.mission.body} onChange={(v) => setS((p) => ({ ...p, mission: { ...p.mission, body: v } }))} textarea />
          <div>
            <label className="text-sm font-medium text-navy">Bullet points (one per line)</label>
            <textarea
              rows={5}
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={formatLines(s.mission.points)}
              onChange={(e) =>
                setS((p) => ({ ...p, mission: { ...p.mission, points: parseLines(e.target.value) } }))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Floating tags (one per line)</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={formatLines(s.mission.tags)}
              onChange={(e) => setS((p) => ({ ...p, mission: { ...p.mission, tags: parseLines(e.target.value) } }))}
            />
          </div>
          <Field label="Badge line (orange pill)" value={s.mission.badgeLine} onChange={(v) => setS((p) => ({ ...p, mission: { ...p.mission, badgeLine: v } }))} />
          <Field label="Image URL" value={s.mission.imageUrl} onChange={(v) => setS((p) => ({ ...p, mission: { ...p.mission, imageUrl: v } }))} />
          <Field label="Image alt" value={s.mission.imageAlt} onChange={(v) => setS((p) => ({ ...p, mission: { ...p.mission, imageAlt: v } }))} />
          <div>
            <label className="text-sm font-medium text-navy">Upload mission image</label>
            <input type="file" accept="image/*" className="mt-1 block text-sm" onChange={(e) => void uploadMission(e.target.files?.[0] ?? null)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CTA label" value={s.mission.ctaLabel} onChange={(v) => setS((p) => ({ ...p, mission: { ...p.mission, ctaLabel: v } }))} />
            <Field label="CTA href" value={s.mission.ctaHref} onChange={(v) => setS((p) => ({ ...p, mission: { ...p.mission, ctaHref: v } }))} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Why Novaflow</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Eyebrow" value={s.why.eyebrow} onChange={(v) => setS((p) => ({ ...p, why: { ...p.why, eyebrow: v } }))} />
          <Field label="Title" value={s.why.title} onChange={(v) => setS((p) => ({ ...p, why: { ...p.why, title: v } }))} />
          {s.why.cards.map((card, idx) => (
            <div key={idx} className="space-y-3 rounded-lg border border-navy/10 p-3">
              <p className="text-xs font-bold uppercase text-navy/50">Card {idx + 1}</p>
              <div>
                <label className="text-xs font-medium text-navy">Icon</label>
                <select
                  className="mt-1 w-full rounded-lg border border-navy/15 px-2 py-2 text-sm"
                  value={card.icon}
                  onChange={(e) => {
                    const icon = e.target.value as WhyIconKey;
                    setS((p) => {
                      const cards = [...p.why.cards];
                      cards[idx] = { ...cards[idx], icon };
                      return { ...p, why: { ...p.why, cards } };
                    });
                  }}
                >
                  {WHY_ICONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Title"
                value={card.title}
                onChange={(v) => {
                  setS((p) => {
                    const cards = [...p.why.cards];
                    cards[idx] = { ...cards[idx], title: v };
                    return { ...p, why: { ...p.why, cards } };
                  });
                }}
              />
              <Field
                label="Body"
                value={card.body}
                onChange={(v) => {
                  setS((p) => {
                    const cards = [...p.why.cards];
                    cards[idx] = { ...cards[idx], body: v };
                    return { ...p, why: { ...p.why, cards } };
                  });
                }}
                textarea
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Testimonials section</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow" value={s.testimonials.eyebrow} onChange={(v) => setS((p) => ({ ...p, testimonials: { ...p.testimonials, eyebrow: v } }))} />
          <Field label="Title" value={s.testimonials.title} onChange={(v) => setS((p) => ({ ...p, testimonials: { ...p.testimonials, title: v } }))} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Home CTA banner</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Eyebrow" value={s.cta.eyebrow} onChange={(v) => setS((p) => ({ ...p, cta: { ...p.cta, eyebrow: v } }))} />
          <Field label="Title" value={s.cta.title} onChange={(v) => setS((p) => ({ ...p, cta: { ...p.cta, title: v } }))} />
          <Field label="Body" value={s.cta.body} onChange={(v) => setS((p) => ({ ...p, cta: { ...p.cta, body: v } }))} textarea />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button" value={s.cta.button} onChange={(v) => setS((p) => ({ ...p, cta: { ...p.cta, button: v } }))} />
            <Field label="Button href" value={s.cta.href} onChange={(v) => setS((p) => ({ ...p, cta: { ...p.cta, href: v } }))} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy">Footer</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Tagline" value={s.footer.tagline} onChange={(v) => setS((p) => ({ ...p, footer: { ...p.footer, tagline: v } }))} />
          <Field label="Blurb" value={s.footer.blurb} onChange={(v) => setS((p) => ({ ...p, footer: { ...p.footer, blurb: v } }))} textarea />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Address line" value={s.footer.address} onChange={(v) => setS((p) => ({ ...p, footer: { ...p.footer, address: v } }))} />
            <Field label="Phone display" value={s.footer.phone} onChange={(v) => setS((p) => ({ ...p, footer: { ...p.footer, phone: v } }))} />
            <Field label="Phone href" value={s.footer.phoneHref} onChange={(v) => setS((p) => ({ ...p, footer: { ...p.footer, phoneHref: v } }))} />
            <Field label="Email display" value={s.footer.email} onChange={(v) => setS((p) => ({ ...p, footer: { ...p.footer, email: v } }))} />
            <Field label="Email href" value={s.footer.emailHref} onChange={(v) => setS((p) => ({ ...p, footer: { ...p.footer, emailHref: v } }))} />
          </div>
        </div>
        <h3 className="mt-6 text-sm font-bold text-navy">Social links</h3>
        <div className="mt-2 space-y-3">
          {s.footer.social.map((soc, idx) => (
            <div key={idx} className="grid gap-2 rounded-lg border border-navy/10 p-3 sm:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-navy">Platform</label>
                <select
                  className="mt-1 w-full rounded-lg border border-navy/15 px-2 py-2 text-sm"
                  value={soc.platform}
                  onChange={(e) => {
                    const platform = e.target.value as (typeof s.footer.social)[0]["platform"];
                    setS((p) => {
                      const social = [...p.footer.social];
                      social[idx] = { ...social[idx], platform };
                      return { ...p, footer: { ...p.footer, social } };
                    });
                  }}
                >
                  <option value="facebook">facebook</option>
                  <option value="x">x</option>
                  <option value="linkedin">linkedin</option>
                  <option value="instagram">instagram</option>
                  <option value="youtube">youtube</option>
                </select>
              </div>
              <Field
                label="Label"
                value={soc.label}
                onChange={(v) => {
                  setS((p) => {
                    const social = [...p.footer.social];
                    social[idx] = { ...social[idx], label: v };
                    return { ...p, footer: { ...p.footer, social } };
                  });
                }}
              />
              <Field
                label="URL"
                value={soc.href}
                onChange={(v) => {
                  setS((p) => {
                    const social = [...p.footer.social];
                    social[idx] = { ...social[idx], href: v };
                    return { ...p, footer: { ...p.footer, social } };
                  });
                }}
              />
            </div>
          ))}
        </div>
        <h3 className="mt-6 text-sm font-bold text-navy">Footer columns</h3>
        <p className="text-xs text-navy/60">Each column: title + links (Label|/path per line)</p>
        <div className="mt-3 space-y-4">
          {s.footer.columns.map((col, idx) => (
            <div key={idx} className="rounded-lg border border-navy/10 p-3">
              <Field
                label="Column title"
                value={col.title}
                onChange={(v) => {
                  setS((p) => {
                    const columns = [...p.footer.columns];
                    columns[idx] = { ...columns[idx], title: v };
                    return { ...p, footer: { ...p.footer, columns } };
                  });
                }}
              />
              <label className="mt-2 block text-xs font-medium text-navy">Links</label>
              <textarea
                rows={6}
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 font-mono text-sm"
                value={formatLinkLines(col.links)}
                onChange={(e) => {
                  setS((p) => {
                    const columns = [...p.footer.columns];
                    columns[idx] = { ...columns[idx], links: parseLinkLines(e.target.value) };
                    return { ...p, footer: { ...p.footer, columns } };
                  });
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-4 flex justify-end rounded-xl border border-navy/10 bg-white/95 p-3 shadow-lg backdrop-blur">
        <Button type="button" onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save all settings"}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
