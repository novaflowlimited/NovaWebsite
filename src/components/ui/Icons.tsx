import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function IconBilling(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M7 14h4M7 17h7" />
    </svg>
  );
}

export function IconCart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l2 12h12l2-8H6" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
    </svg>
  );
}

export function IconPill(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10.5 3.5l10 10a4.95 4.95 0 1 1-7 7l-10-10a4.95 4.95 0 1 1 7-7Z" />
      <path d="M7 7l10 10" />
    </svg>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1.4 3.4A8 8 0 0 1 21 12Z" />
      <path d="M8 11h8M8 14h5" />
    </svg>
  );
}

export function IconCpu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </svg>
  );
}

export function IconWifi(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 8.5a17 17 0 0 1 20 0" />
      <path d="M5 12a12 12 0 0 1 14 0" />
      <path d="M8.5 15.5a7 7 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1.2" />
    </svg>
  );
}

export function IconTower(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4l3 16M18 4l-3 16M9 20h6" />
      <path d="M8 9h8M7 13h10" />
      <path d="M12 4v16" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21h18" />
      <path d="M6 17v-5M11 17V8M16 17v-7M21 17V5" />
    </svg>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M19 16l.7 1.8L21.5 18.5 19.7 19.2 19 21l-.7-1.8L16.5 18.5l1.8-.7L19 16Z" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconSchool(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10l9-5 9 5-9 5-9-5Z" />
      <path d="M6 11.5v5c2 2 10 2 12 0v-5" />
      <path d="M21 10v6" />
    </svg>
  );
}

export function IconCross(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function IconBadge(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l2.5 4.5L19 8l-3.5 3.5L16 16l-4-2-4 2 .5-4.5L5 8l4.5-.5L12 3Z" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M14.5 14.5c2.5.4 4.5 2 4.5 5.5" />
    </svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4h3l2 4-2 1a11 11 0 0 0 7 7l1-2 4 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function IconLayers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l9 5-9 5-9-5 9-5Z" />
      <path d="M3 13l9 5 9-5M3 18l9 5 9-5" />
    </svg>
  );
}

const map = {
  layers: IconLayers,
  "shopping-cart": IconCart,
  pill: IconPill,
  message: IconMessage,
  cpu: IconCpu,
  wifi: IconWifi,
  tower: IconTower,
  shield: IconShield,
  chart: IconChart,
  sparkle: IconSparkle,
  check: IconCheck,
  school: IconSchool,
  cross: IconCross,
  badge: IconBadge,
  users: IconUsers,
} as const;

export type IconName = keyof typeof map;

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = (map[name as IconName] ?? IconLayers) as (p: IconProps) => ReactElement;
  return <Cmp className={className} aria-hidden />;
}
