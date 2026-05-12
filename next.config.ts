import type { NextConfig } from "next";

const extraHosts =
  process.env.NEXT_PUBLIC_IMAGE_HOSTS?.split(",").map((h) => h.trim()).filter(Boolean) ?? [];

function hostFromEnvUrl(url: string | undefined): string | null {
  if (!url?.trim()) return null;
  try {
    return new URL(url.trim()).hostname;
  } catch {
    return null;
  }
}

const r2Host = hostFromEnvUrl(process.env.R2_PUBLIC_URL);
const r2Hosts = r2Host && !extraHosts.includes(r2Host) ? [r2Host] : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      ...r2Hosts.map((hostname) => ({
        protocol: "https" as const,
        hostname,
        pathname: "/**" as const,
      })),
      ...extraHosts.map((hostname) => ({
        protocol: "https" as const,
        hostname,
        pathname: "/**" as const,
      })),
    ],
  },
};

export default nextConfig;
