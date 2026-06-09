# Klinik Hewan App

Project skeleton for Klinik Hewan App — Next.js 14 + TypeScript, Prisma, NextAuth, Tailwind.

Run locally:

```bash
cd klinik-hewan
cp .env.example .env
# set DATABASE_URL to your Postgres
npm install
npx prisma generate
npm run prisma:seed
npm run dev
```

Docker: see `Dockerfile` for a simple image.

Scheduler / Pengingat Email:

- Untuk lingkungan produksi, jalankan `npm run send-reminders` secara berkala (cron/systemd) atau gunakan worker.

Contoh cron (setiap jam):

```bash
# jalankan dari folder `klinik-hewan`
0 * * * * /usr/bin/node /path/to/klinik-hewan/scripts/send-reminders.js >> /var/log/klinik-reminders.log 2>&1
```

Atau panggil endpoint manual:

```bash
curl -X POST http://localhost:3000/api/appointments/send-reminders -H 'Content-Type: application/json' -d '{"hours":24}'
```

Reset password flow:

- Request reset (body: `{ "email": "user@example.com" }`):

```bash
curl -X POST http://localhost:3000/api/auth/request-reset -H 'Content-Type: application/json' -d '{"email":"user@example.com"}'
```

- Reset password (body: `{ "token": "...", "password": "newpass" }`):

```bash
curl -X POST http://localhost:3000/api/auth/reset-password -H 'Content-Type: application/json' -d '{"token":"...","password":"NewPass123"}'
```


