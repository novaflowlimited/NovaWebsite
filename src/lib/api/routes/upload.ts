import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Hono } from "hono";
import { buildUploadKey, createR2Client, getR2Config, publicObjectUrl } from "@/lib/r2";
import { requireAuth } from "../middleware/auth";

const upload = new Hono();

/** Multipart file upload to Cloudflare R2 (S3-compatible). Falls back to dev stub if R2 env is incomplete. */
upload.post("/", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.parseBody({ all: true });
  const file = body.file;
  if (!(file instanceof File) || file.size === 0) {
    return c.json({ error: "Expected multipart field \"file\"" }, 400);
  }

  const client = createR2Client();
  const cfg = getR2Config();
  if (!client || !cfg) {
    const safeName = encodeURIComponent(file.name.replace(/[^a-zA-Z0-9._-]/g, "_"));
    const publicUrl = `https://picsum.photos/seed/${safeName}/1200/630`;
    return c.json({
      publicUrl,
      note: "R2 not configured (set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL). Using placeholder URL.",
    });
  }

  const key = buildUploadKey(file.name);
  const buf = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  await client.send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: buf,
      ContentType: contentType,
    }),
  );

  const publicUrl = publicObjectUrl(key);
  if (!publicUrl) return c.json({ error: "Could not build public URL" }, 500);
  return c.json({ publicUrl });
});

/** @deprecated — use POST /api/upload with multipart instead */
upload.post("/presign", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{ filename: string; contentType?: string }>();
  const safeName = encodeURIComponent(body.filename.replace(/[^a-zA-Z0-9._-]/g, "_"));
  const publicUrl = `https://picsum.photos/seed/${safeName}/1200/630`;
  return c.json({
    method: "GET" as const,
    uploadUrl: publicUrl,
    publicUrl,
    note: "Deprecated: use POST /api/upload with multipart field \"file\". R2 uploads use that route when configured.",
  });
});

export { upload as uploadRoutes };
