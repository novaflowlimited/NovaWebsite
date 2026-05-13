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

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/10 pt-7 text-xs text-white/75 md:flex-row md:justify-between">
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
            {footer.whatsappHref?.trim() ? (
              <a
                href={footer.whatsappHref.trim()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <IconWhatsApp className="h-3.5 w-3.5" />
                {footer.whatsappLabel?.trim() || "WhatsApp"}
              </a>
            ) : null}
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

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
