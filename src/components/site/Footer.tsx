import Link from "next/link";
import type { ReactElement } from "react";
import { BrandLogoMark } from "@/components/site/BrandLogoMark";
import { IconMail, IconMapPin, IconPhone } from "@/components/ui/Icons";
import type { SiteSettingsPayload, SocialPlatform } from "@/lib/site-settings-payload";

const year = new Date().getFullYear();

const SOCIAL_ICONS: Record<SocialPlatform, () => ReactElement> = {
  facebook: FacebookIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
};

export function Footer({ settings }: { settings: SiteSettingsPayload }) {
  const { companyName, copyrightEntity, footer, brand } = settings;

  return (
    <footer className="bg-navy-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogoMark logoUrl={brand.logoUrl} logoAlt={brand.logoAlt} variant="footer" />
              <span className="text-lg font-bold tracking-tight">{companyName}</span>
            </Link>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-orange-soft">{footer.tagline}</p>
            <p className="mt-4 text-sm text-white/70">{footer.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {footer.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform] ?? FacebookIcon;
                return (
                  <a
                    key={`${s.platform}-${s.href}`}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orange hover:text-white"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {footer.columns.map((col) => (
            <FooterColumn key={col.title} title={col.title} links={col.links} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/10 pt-7 text-xs text-white/65 md:flex-row md:justify-between">
          <p>
            © {year} {copyrightEntity}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <IconMapPin className="h-3.5 w-3.5" /> {footer.address}
            </span>
            <a href={footer.phoneHref} className="inline-flex items-center gap-1.5 hover:text-white">
              <IconPhone className="h-3.5 w-3.5" /> {footer.phone}
            </a>
            <a href={footer.emailHref} className="inline-flex items-center gap-1.5 hover:text-white">
              <IconMail className="h-3.5 w-3.5" /> {footer.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-white/70">
        {links.map((l) => (
          <li key={`${title}-${l.label}`}>
            <Link href={l.href} className="transition hover:text-orange">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M13 22v-8h3l.5-4H13V7.5c0-1.1.4-1.8 2-1.8h1.6V2.1C16.3 2 15.2 2 14 2c-2.7 0-4.5 1.6-4.5 4.6V10H7v4h2.5v8H13Z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M18.5 2H22l-7.5 8.6L23 22h-7l-5.3-6.7L4.5 22H1l8-9.2L1 2h7.1l4.8 6.2L18.5 2Zm-2.5 18h2L7.5 4h-2L16 20Z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 8h4.2v14H.4V8Zm7.4 0h4v2h.1c.6-1 2-2.2 4-2.2 4.3 0 5.1 2.8 5.1 6.4V22h-4.2v-7c0-1.7 0-3.8-2.3-3.8s-2.6 1.8-2.6 3.6V22H7.8V8Z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z" />
    </svg>
  );
}
