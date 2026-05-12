# NovaWebsite

Public marketing site and admin CMS for Novaflow — Next.js (App Router), Prisma, PostgreSQL, Tailwind.

## Local setup

1. Copy `.env.example` to `.env` and set secrets / `DATABASE_URL`.
2. Start Postgres (e.g. `docker compose up -d`), then `npm run db:migrate` and optionally `npm run db:seed`.
3. `npm install` and `npm run dev`.

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build  
- `npm run db:migrate` — apply Prisma migrations (production / CI)  
- `npm run db:migrate:dev` — create migrations in development  
- `npm run db:seed` — seed sample data  
