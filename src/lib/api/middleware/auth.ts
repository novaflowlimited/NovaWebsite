import { verify } from "hono/jwt";

export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me-in-production-min-32-chars";

export async function requireAuth(
  authorization: string | undefined,
): Promise<{ sub: string; email: string } | null> {
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length);
  try {
    const payload = (await verify(token, JWT_SECRET, "HS256")) as { sub?: string; email?: string };
    if (!payload.sub || !payload.email) return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
