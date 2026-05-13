export type NavLink = { href: string; label: string };

export type SocialPlatform = "facebook" | "x" | "linkedin" | "instagram" | "youtube";

export type SocialLink = { platform: SocialPlatform; href: string; label: string };

export type FooterColumn = { title: string; links: NavLink[] };

export type WhyIconKey = "chart" | "cpu" | "shield" | "sparkle";

export type SiteSettingsPayload = {
  companyName: string;
  copyrightEntity: string;
  /** Site-wide logo (navbar, footer, mock UI). Leave URL empty to use the “N” monogram. */
  brand: {
    logoUrl: string;
    logoAlt: string;
  };
  /** Impact page photography (backgrounds / hero). */
  impact: {
    heroBgUrl: string;
    heroBgAlt: string;
    partnerCtaBgUrl: string;
    partnerCtaBgAlt: string;
    infrastructurePhotoUrl: string;
    infrastructurePhotoAlt: string;
  };
  navbar: {
    tagline: string;
    ctaLabel: string;
    ctaHref: string;
    desktopLinks: NavLink[];
    mobileLinks: NavLink[];
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    titleLine4: string;
    subtitle: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
    imageUrl: string;
    imageAlt: string;
    visualSidebar: string[];
    revenueLabel: string;
    revenueValue: string;
    revenueTrendLabel: string;
    revenueBadge: string;
    aiCardEyebrow: string;
    aiCardTitle: string;
    aiCardHint: string;
    uptimeChip: string;
  };
  clientLogos: { eyebrow: string; andMoreLabel: string };
  /** Second homepage logo row — companies using your software (logos with `stripKind` SOFTWARE_CUSTOMERS). */
  softwareCustomersLogos: { eyebrow: string; andMoreLabel: string };
  /** Optional line above the homepage impact stats row (the number strip). Empty = hidden. */
  statsStrip: { eyebrow: string };
  ecosystem: {
    eyebrow: string;
    title: string;
    subtitle: string;
    slugs: string[];
    learnMoreLabel: string;
  };
  mission: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
    tags: string[];
    badgeLine: string;
    imageUrl: string;
    imageAlt: string;
    ctaLabel: string;
    ctaHref: string;
  };
  why: {
    eyebrow: string;
    title: string;
    cards: { icon: WhyIconKey; title: string; body: string }[];
  };
  testimonials: { eyebrow: string; title: string };
  cta: { eyebrow: string; title: string; body: string; button: string; href: string };
  footer: {
    tagline: string;
    blurb: string;
    address: string;
    phone: string;
    phoneHref: string;
    email: string;
    emailHref: string;
    columns: FooterColumn[];
    social: SocialLink[];
  };
  seo: {
    /** Overrides the homepage `<title>` when non-empty; otherwise derived from company + hero subtitle. */
    homeTitle: string;
    /** Global meta description when non-empty; otherwise hero subtitle, then footer blurb. */
    metaDescription: string;
    /** `meta name="keywords"` (edit in admin; e.g. ISP billing Kenya, rural WiFi). */
    keywords: string[];
  };
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsPayload = {
  companyName: "Novaflow",
  copyrightEntity: "Novaflow Limited",
  brand: {
    logoUrl: "",
    logoAlt: "Novaflow",
  },
  impact: {
    heroBgUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1800&q=80",
    heroBgAlt: "Team collaborating in a modern office",
    partnerCtaBgUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80",
    partnerCtaBgAlt: "Hands joined in partnership",
    infrastructurePhotoUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&q=80",
    infrastructurePhotoAlt: "Internet tower installation",
  },
  navbar: {
    tagline: "Connect · Build · Innovate",
    ctaLabel: "Get a Demo",
    ctaHref: "/contact",
    desktopLinks: [
      { href: "/", label: "Home" },
      { href: "/services", label: "Products" },
      { href: "/impact", label: "Impact" },
      { href: "/about", label: "Company" },
    ],
    mobileLinks: [
      { href: "/", label: "Home" },
      { href: "/services", label: "Products & Services" },
      { href: "/impact", label: "Impact" },
      { href: "/pricing", label: "Pricing" },
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
    ],
  },
  hero: {
    badge: "Powering Africa's digital future",
    titleLine1: "Technology for",
    titleLine2: "businesses.",
    titleLine3: "Connectivity for",
    titleLine4: "communities.",
    subtitle:
      "SaaS solutions, AI automation and IoT innovations — connecting underserved communities and powering modern enterprises across Africa.",
    primaryCta: "Get a Demo",
    primaryHref: "/contact",
    secondaryCta: "Explore Solutions",
    secondaryHref: "/services",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80",
    imageAlt: "Connected community in Kenya",
    visualSidebar: ["Dashboard", "Customers", "Billing", "Reports", "Network", "Settings"],
    revenueLabel: "Revenue",
    revenueValue: "KSh 8.4M",
    revenueTrendLabel: "Revenue Trend",
    revenueBadge: "+16.5%",
    aiCardEyebrow: "AI Automations",
    aiCardTitle: "1,246",
    aiCardHint: "running",
    uptimeChip: "99.9% Uptime",
  },
  clientLogos: {
    eyebrow: "Trusted by organizations making impact",
    andMoreLabel: "and more",
  },
  softwareCustomersLogos: {
    eyebrow: "Software trusted by leading organizations",
    andMoreLabel: "and more",
  },
  statsStrip: {
    eyebrow: "",
  },
  ecosystem: {
    eyebrow: "Our Products Ecosystem",
    title: "Powerful solutions for every sector",
    subtitle:
      "From ISP operations to retail, healthcare and automation — our products help businesses run smarter and communities stay connected.",
    slugs: ["isp-billing", "retail-pos", "pharmacy-pos", "whatsapp-api", "ai-automation"],
    learnMoreLabel: "Learn more",
  },
  mission: {
    eyebrow: "Our Mission",
    title: "Building digital opportunity where it has never existed.",
    body: "We install internet in underserved rural communities and provide free WiFi to public institutions — because connectivity changes lives.",
    points: [
      "Free WiFi for schools, dispensaries, police stations and community centers.",
      "Bridging the digital divide for rural Kenya.",
      "Creating opportunities for education, healthcare and economic growth.",
    ],
    tags: ["Rural Communities", "Connected Every Day"],
    badgeLine: "▲ 250+ Schools by 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1637148602945-433108982492?w=1200&q=85&auto=format&fit=crop",
    imageAlt: "Kenyan primary school learners in a classroom",
    ctaLabel: "See Our Impact",
    ctaHref: "/impact",
  },
  why: {
    eyebrow: "Why choose Novaflow",
    title: "Enterprise grade technology. Human centered mission.",
    cards: [
      {
        icon: "chart",
        title: "Reliable Infrastructure",
        body: "High availability networks with 24/7 monitoring and proactive support.",
      },
      {
        icon: "cpu",
        title: "AI & Automation",
        body: "Practical AI that improves efficiency, accuracy and reduces costs.",
      },
      {
        icon: "shield",
        title: "Secure & Compliant",
        body: "Enterprise security with data protection and compliance built in.",
      },
      {
        icon: "sparkle",
        title: "Impact Driven",
        body: "Every connection creates opportunity and transforms lives.",
      },
    ],
  },
  testimonials: {
    eyebrow: "What our clients say",
    title: "Trusted voices from across Kenya",
  },
  cta: {
    eyebrow: "Let's build together",
    title: "Let's build Africa's connected future together.",
    body: "Whether you're a business, government or community organization — we'd love to connect, build and innovate with you.",
    button: "Get in Touch",
    href: "/contact",
  },
  footer: {
    tagline: "Connect · Build · Innovate",
    blurb: "We build technology and networks that power businesses and connect communities across Africa.",
    address: "Nairobi, Kenya",
    phone: "+254 700 123 456",
    phoneHref: "tel:+254700123456",
    email: "hello@novaflow.co.ke",
    emailHref: "mailto:hello@novaflow.co.ke",
    columns: [
      {
        title: "Products",
        links: [
          { href: "/services/isp-billing", label: "ISP Billing System" },
          { href: "/services/retail-pos", label: "Retail POS" },
          { href: "/services/pharmacy-pos", label: "Pharmacy POS" },
          { href: "/services/whatsapp-api", label: "WhatsApp API" },
          { href: "/services/ai-automation", label: "AI Automation" },
          { href: "/services/iot-solutions", label: "IoT Solutions" },
        ],
      },
      {
        title: "Services",
        links: [
          { href: "/services/rural-connectivity", label: "Internet Installation" },
          { href: "/services", label: "Network Management" },
          { href: "/services/ai-automation", label: "Business Consulting" },
          { href: "/contact", label: "Free WiFi Program" },
          { href: "/services", label: "System Integration" },
          { href: "/contact", label: "Support & Maintenance" },
        ],
      },
      {
        title: "Impact",
        links: [
          { href: "/about", label: "Our Mission" },
          { href: "/impact", label: "Communities" },
          { href: "/contact", label: "Free WiFi Program" },
          { href: "/impact", label: "Stories" },
          { href: "/about", label: "Partners" },
        ],
      },
      {
        title: "Company",
        links: [
          { href: "/about", label: "About Us" },
          { href: "/careers", label: "Careers" },
          { href: "/blog", label: "Blog" },
          { href: "/pricing", label: "Pricing" },
          { href: "/contact", label: "Contact" },
        ],
      },
    ],
    social: [
      { platform: "facebook", href: "https://facebook.com", label: "Facebook" },
      { platform: "x", href: "https://x.com", label: "X" },
      { platform: "linkedin", href: "https://linkedin.com", label: "LinkedIn" },
      { platform: "instagram", href: "https://instagram.com", label: "Instagram" },
      { platform: "youtube", href: "https://youtube.com", label: "YouTube" },
    ],
  },
  seo: {
    homeTitle: "",
    metaDescription: "",
    keywords: [],
  },
};
