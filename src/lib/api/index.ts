import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { postsRoutes } from "./routes/posts";
import { servicesRoutes } from "./routes/services";
import { impactRoutes } from "./routes/impact";
import { testimonialsRoutes } from "./routes/testimonials";
import { clientLogosRoutes } from "./routes/client-logos";
import { teamRoutes } from "./routes/team";
import { jobsRoutes } from "./routes/jobs";
import { authRoutes } from "./routes/auth";
import { uploadRoutes } from "./routes/upload";
import { contactRoutes } from "./routes/contact";
import { siteSettingsRoutes } from "./routes/site-settings";

const app = new Hono().basePath("/api");

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true }));

app.route("/posts", postsRoutes);
app.route("/services", servicesRoutes);
app.route("/impact", impactRoutes);
app.route("/testimonials", testimonialsRoutes);
app.route("/client-logos", clientLogosRoutes);
app.route("/team", teamRoutes);
app.route("/jobs", jobsRoutes);
app.route("/auth", authRoutes);
app.route("/upload", uploadRoutes);
app.route("/contact", contactRoutes);
app.route("/site-settings", siteSettingsRoutes);

export type ApiApp = typeof app;
export default app;
