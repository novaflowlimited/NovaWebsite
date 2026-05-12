import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBase: string;
};

export function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET_NAME?.trim();
  const publicBase = process.env.R2_PUBLIC_URL?.trim().replace(/\/$/, "");
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket, publicBase };
}

export function createR2Client(): S3Client | null {
  const c = getR2Config();
  if (!c) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${c.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: c.accessKeyId,
      secretAccessKey: c.secretAccessKey,
    },
  });
}

export function publicObjectUrl(key: string): string | null {
  const c = getR2Config();
  if (!c) return null;
  const encoded = key.split("/").map(encodeURIComponent).join("/");
  return `${c.publicBase}/${encoded}`;
}

export function buildUploadKey(originalName: string): string {
  const safe = originalName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const t = Date.now();
  const r = Math.random().toString(36).slice(2, 10);
  return `uploads/${t}-${r}-${safe}`;
}
