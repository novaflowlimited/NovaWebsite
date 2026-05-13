import { z } from "zod";

const navLinkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
});

const socialPlatformSchema = z.enum(["facebook", "x", "linkedin", "instagram", "youtube"]);

const socialLinkSchema = z.object({
  platform: socialPlatformSchema,
  href: z.string().min(1),
  label: z.string().min(1),
});

const footerColumnSchema = z.object({
  title: z.string().min(1),
  links: z.array(navLinkSchema).min(1),
});

const whyIconSchema = z.enum(["chart", "cpu", "shield", "sparkle"]);

const whyCardSchema = z.object({
  icon: whyIconSchema,
  title: z.string().min(1),
  body: z.string().min(1),
});

export const siteSettingsPayloadSchema = z.object({
  companyName: z.string().min(1),
  copyrightEntity: z.string().min(1),
  brand: z.object({
    logoUrl: z.string(),
    logoAlt: z.string().min(1),
  }),
  impact: z.object({
    heroBgUrl: z.string().min(1),
    heroBgAlt: z.string().min(1),
    partnerCtaBgUrl: z.string().min(1),
    partnerCtaBgAlt: z.string().min(1),
    infrastructurePhotoUrl: z.string().min(1),
    infrastructurePhotoAlt: z.string().min(1),
  }),
  navbar: z.object({
    tagline: z.string().min(1),
    ctaLabel: z.string().min(1),
    ctaHref: z.string().min(1),
    desktopLinks: z.array(navLinkSchema).min(1),
    mobileLinks: z.array(navLinkSchema).min(1),
  }),
  hero: z.object({
    badge: z.string().min(1),
    titleLine1: z.string().min(1),
    titleLine2: z.string().min(1),
    titleLine3: z.string().min(1),
    titleLine4: z.string().min(1),
    subtitle: z.string().min(1),
    primaryCta: z.string().min(1),
    primaryHref: z.string().min(1),
    secondaryCta: z.string().min(1),
    secondaryHref: z.string().min(1),
    imageUrl: z.string().min(1),
    imageAlt: z.string().min(1),
    visualSidebar: z.array(z.string()).min(1),
    revenueLabel: z.string().min(1),
    revenueValue: z.string().min(1),
    revenueTrendLabel: z.string().min(1),
    revenueBadge: z.string().min(1),
    aiCardEyebrow: z.string().min(1),
    aiCardTitle: z.string().min(1),
    aiCardHint: z.string().min(1),
    uptimeChip: z.string().min(1),
  }),
  clientLogos: z.object({
    eyebrow: z.string().min(1),
    andMoreLabel: z.string().min(1),
  }),
  softwareCustomersLogos: z.object({
    eyebrow: z.string().min(1),
    andMoreLabel: z.string().min(1),
  }),
  statsStrip: z.object({
    eyebrow: z.string(),
  }),
  ecosystem: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    slugs: z.array(z.string().min(1)).min(1),
    learnMoreLabel: z.string().min(1),
  }),
  mission: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
    points: z.array(z.string().min(1)).min(1),
    tags: z.array(z.string().min(1)).min(1),
    badgeLine: z.string().min(1),
    imageUrl: z.string().min(1),
    imageAlt: z.string().min(1),
    ctaLabel: z.string().min(1),
    ctaHref: z.string().min(1),
  }),
  why: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    cards: z.array(whyCardSchema).min(1),
  }),
  testimonials: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
  }),
  cta: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
    button: z.string().min(1),
    href: z.string().min(1),
  }),
  footer: z.object({
    tagline: z.string().min(1),
    blurb: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
    phoneHref: z.string().min(1),
    email: z.string().min(1),
    emailHref: z.string().min(1),
    columns: z.array(footerColumnSchema).min(1),
    social: z.array(socialLinkSchema).min(1),
  }),
  /** Search / social previews — all editable in admin (no hardcoded marketing strings required). */
  seo: z.object({
    homeTitle: z.string().max(120),
    metaDescription: z.string().max(320),
    keywords: z.array(z.string().max(80)).max(40),
  }),
});

export type ParsedSiteSettings = z.infer<typeof siteSettingsPayloadSchema>;
