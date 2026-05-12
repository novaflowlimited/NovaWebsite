# NovaWebsite

Public marketing site and admin CMS for Novaflow — Next.js (App Router), Prisma, PostgreSQL, Tailwind.

## Local setup

1. Copy `.env.example` to `.env` and set secrets / `DATABASE_URL`.
2. Start Postgres: `docker compose up -d` (Docker maps **host port 5433** so it does not clash with another Postgres on 5432).
3. `npm run db:migrate` and optionally `npm run db:seed`.
4. `npm install` and `npm run dev`.

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build  
- `npm run db:migrate` — apply Prisma migrations (production / CI)  
- `npm run db:migrate:dev` — create migrations in development  
- `npm run db:seed` — seed sample data  

## Production (PM2 + nginx)

1. On the server: clone repo, `npm ci`, copy `.env` with production `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL` (https), R2 keys if used.
2. `docker compose up -d` (or use a managed Postgres; if Docker on same host, keep port **5433** in `DATABASE_URL`).
3. `npm run build` then `npx prisma migrate deploy`.
4. **PM2:** from repo root: `pm2 start ecosystem.config.cjs` — serves Next on **port 3000**. Then `pm2 save` / `pm2 startup` as you prefer.
5. **nginx:** adapt `deploy/nginx-nova-website.example.conf` (replace `server_name`, add TLS). Proxy to `http://127.0.0.1:3000`.
