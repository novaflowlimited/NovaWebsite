/**
 * PM2 process file — production Next.js server.
 *
 * Usage (from repo root, after `npm run build`):
 *   pm2 start ecosystem.config.cjs
 *   pm2 save && pm2 startup
 *
 * Put secrets in `.env` on the server (not committed). Next.js loads `.env` / `.env.production`
 * when `next start` runs from `cwd`.
 */
const cwd = __dirname;

module.exports = {
  apps: [
    {
      name: "nova-website",
      cwd,
      script: "npm",
      args: "run start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
