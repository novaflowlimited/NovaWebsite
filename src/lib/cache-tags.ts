/**
 * Next.js Data Cache tags: use in server `fetch` / `publicFetch` `next.tags`,
 * then `revalidateTag(..., "max")` after admin writes so public pages refresh.
 */
export const CACHE_TAGS = {
  siteSettings: "site-settings",
  impactStats: "impact-stats",
  impactStories: "impact-stories",
  impactMapFeature: "impact-map-feature",
  clientLogos: "client-logos",
  services: "services",
  testimonials: "testimonials",
  team: "team",
  posts: "posts",
  jobs: "jobs",
} as const;
