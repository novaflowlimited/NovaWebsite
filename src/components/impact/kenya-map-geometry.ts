/** Simplified Kenya outline (lon/lat ring → viewBox 0 0 220 260). */
export const KENYA_OUTLINE_D =
  "M19.2 151.5 L31.1 113.9 L50.2 87.1 L69.4 71 L107.6 44.2 L141.1 33.5 L172.1 38.8 L188.9 71 L198.4 113.9 L193.7 167.5 L165 205.1 L124.3 237.3 L64.6 242.6 L21.6 199.7 L15.6 159.5 Z";

export type MapDotStatus = "connected" | "in-progress" | "planned";

/** Approximate rollout sites (same projection as outline). */
export const KENYA_MAP_DOTS: { x: number; y: number; status: MapDotStatus }[] = [
  { x: 84.2, y: 153.9, status: "connected" },
  { x: 152.3, y: 227.9, status: "connected" },
  { x: 34.9, y: 116.9, status: "connected" },
  { x: 47.1, y: 105.3, status: "in-progress" },
  { x: 151.6, y: 107.5, status: "planned" },
  { x: 66.3, y: 127.3, status: "connected" },
  { x: 163.1, y: 205.6, status: "in-progress" },
  { x: 40.7, y: 91.9, status: "connected" },
  { x: 102.4, y: 109.9, status: "in-progress" },
  { x: 55, y: 35.6, status: "planned" },
  { x: 94.7, y: 160, status: "connected" },
];
