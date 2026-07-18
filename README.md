# Lost & Found Hub

ระบบประกาศของหายและของที่พบภายในมหาวิทยาลัย — Full-stack, production-ready.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, React Hook Form + Zod
- **Backend**: Next.js API Routes (REST), Prisma ORM, JWT auth (httpOnly cookie), bcrypt
- **Database**: PostgreSQL (Supabase)
- **Storage**: Cloudinary
- **Deployment**: Vercel

## Features
- Register / Login / Logout with JWT + bcrypt, route protection via middleware
- Editable profile (avatar, phone, faculty, student ID)
- Home page with hero search, live stats, latest lost/found items
- Create Lost/Found items with multi-image upload, category, color, brand, contact channel, location, date, map coordinates
- Real-time search with filters (category, date, location, color, brand, type) and sorting
- Item detail page with gallery, owner info, favorite, share, claim request
- Claim workflow: request → owner approves/rejects → notifications → item marked Returned
- Notifications for claim requested / approved / rejected
- Admin dashboard: stats, manage users (ban/unban), manage items (delete)
- Dark/light mode, glassmorphism SaaS-style UI, responsive, loading skeletons

## Project Structure
```
app/            routes (pages + API routes), grouped by feature
  api/          REST API endpoints
  (auth)/       login, register
  items/        listing, detail, create, edit
  dashboard/    user dashboard (items, favorites, claims, notifications)
  admin/        admin dashboard
components/
  ui/           design-system primitives (Button, Input, Card, Badge...)
  layout/       Navbar, Footer, ThemeProvider
  items/        ItemCard, ItemGrid, ItemFilters, ItemGallery, ItemActions
  forms/        LoginForm, RegisterForm, ItemForm, ClaimForm, ProfileForm, ImageUploader
hooks/          useAuth, useDebounce
lib/            prisma client, auth, validations (zod), cloudinary, rate-limit, utils
prisma/         schema.prisma, seed.ts
types/          shared TypeScript types
middleware.ts   route protection
docs/           API.md, ER_DIAGRAM.md, SETUP.md
```

## Quick start
See [`docs/SETUP.md`](docs/SETUP.md) for full setup, environment variables, database migration/seed, and Vercel deployment steps.

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, CLOUDINARY_*
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## API
See [`docs/API.md`](docs/API.md) for the full REST API reference.

## Database schema
See [`docs/ER_DIAGRAM.md`](docs/ER_DIAGRAM.md) for the entity-relationship diagram.

## Security notes
- Passwords hashed with bcrypt (10 rounds)
- JWT stored in an httpOnly, sameSite=lax cookie (not accessible to JS, mitigates XSS token theft)
- All API input validated with Zod
- `middleware.ts` blocks unauthenticated access to `/dashboard`, `/profile`, `/items/new`, `/admin`; admin routes further require `role: ADMIN`
- Basic in-memory rate limiting on register/login/upload (swap for Upstash Redis in multi-instance production, see SETUP.md)
- Prisma's parameterized queries prevent SQL injection by default
- React auto-escapes output, mitigating XSS; avoid `dangerouslySetInnerHTML` with user content
