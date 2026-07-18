# Setup Guide

## 1. Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) PostgreSQL project (or any PostgreSQL instance)
- A [Cloudinary](https://cloudinary.com) account

## 2. Install
```bash
npm install
```

## 3. Environment variables
Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` / `DIRECT_URL` — from Supabase → Project Settings → Database (use the pooled URL for `DATABASE_URL` and the direct URL for `DIRECT_URL`)
- `JWT_SECRET` — a long random string (e.g. `openssl rand -base64 48`)
- `CLOUDINARY_*` — from your Cloudinary dashboard

## 4. Database
```bash
npx prisma migrate dev --name init
npx prisma db seed
```
This seeds default categories and an admin account:
- email: `admin@university.ac.th`
- password: `Admin@12345`
**Change this password immediately after first login.**

## 5. Run locally
```bash
npm run dev
```
App runs at http://localhost:3000

## 6. Deploy to Vercel
1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add the same environment variables in Vercel → Project → Settings → Environment Variables.
4. Set the build command to `next build` (default) — `prisma generate` runs automatically via `postinstall`.
5. After the first deploy, run `npx prisma migrate deploy` against your production database (locally with `DATABASE_URL` pointed at prod, or via a one-off Vercel deployment hook).

## 7. Optional: Redis rate limiting
`lib/rate-limit.ts` ships with an in-memory limiter suitable for a single instance. For serverless/multi-region deployments on Vercel, swap it for `@upstash/ratelimit` + `@upstash/redis` using `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.
