import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { prisma } from "@/lib/db";
import { JWT_SECRET } from "../middleware/auth";

const auth = new Hono();

auth.post("/login", async (c) => {
  const body = await c.req.json<{ email: string; password: string }>();
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) return c.json({ error: "Invalid credentials" }, 401);
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) return c.json({ error: "Invalid credentials" }, 401);
  const token = await sign(
    {
      sub: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    JWT_SECRET,
    "HS256",
  );
  return c.json({ token });
});

export { auth as authRoutes };
