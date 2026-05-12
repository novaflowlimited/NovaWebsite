import Image from "next/image";
import type { ClientLogo } from "@/types";

/** Renders CMS `logoUrl` when set; otherwise the organization name as styled text. */
export function ClientLogoDisplay({
  logo,
  className = "",
}: {
  logo: ClientLogo;
  className?: string;
}) {
  const url = logo.logoUrl?.trim();
  if (url) {
    return (
      <span className={`relative inline-block h-9 w-[min(100%,160px)] md:h-11 md:w-[180px] ${className}`}>
        <Image
          src={url}
          alt={logo.name}
          fill
          className="object-contain object-center"
          sizes="180px"
        />
      </span>
    );
  }
  return (
    <span
      className={`text-base font-extrabold tracking-tight text-navy/70 opacity-80 transition hover:text-navy hover:opacity-100 md:text-lg ${className}`}
      style={{
        fontFeatureSettings: '"ss01"',
        letterSpacing: "-0.02em",
      }}
    >
      {logo.name}
    </span>
  );
}
