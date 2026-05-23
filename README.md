# Nexus | E-Commerce Admin Dashboard

Production-ready E-Commerce Admin Dashboard built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Shadcn UI.

This project has been migrated from MongoDB/Mongoose/JWT/Cloudinary to:
- Supabase PostgreSQL
- Prisma ORM
- Supabase Auth (cookie-based sessions)
- Supabase Storage

The UI, pages, components, animations, and responsive behavior are intentionally preserved.

## Stack
- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS 4
- Framer Motion
- Shadcn UI
- Prisma + PostgreSQL
- Supabase Auth + Supabase Storage

## Environment Variables
Create `.env` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres
```

## Supabase Setup
1. Create a Supabase project.
2. Copy `Project URL`, `anon key`, and `service_role key` from API settings.
3. Copy your Postgres connection string into `DATABASE_URL`.
4. Create a **public** storage bucket named `product-images`.

## Prisma Setup
Generate and apply schema:

```bash
npx prisma generate
npx prisma migrate dev --name supabase_init
```

If you deploy with CI/CD, run:

```bash
npx prisma migrate deploy
```

## Local Development
```bash
npm install
npm run dev
```

## Build Verification
```bash
npm run build
```

## Auth Flow
- `/api/auth/signup`: Creates Supabase Auth user and corresponding Prisma `Admin` row, then starts a Supabase session.
- `/api/auth/login`: Signs in with Supabase Auth and sets auth cookies.
- `/api/auth/logout`: Signs out and clears session cookies.
- `src/proxy.ts`: Protects dashboard/API routes and redirects based on Supabase session state.

## API/Data Notes
- Product/Order/Customer APIs now use Prisma.
- Responses keep `_id` compatibility for existing frontend components.
- Uploads use Supabase Storage and keep `result.secure_url` response compatibility for existing product form logic.

## Vercel Deployment
1. Import repo in Vercel.
2. Set environment variables from `.env.example`.
3. Ensure Prisma migrations are applied (`prisma migrate deploy`).
4. Deploy.

## Key Migration Files
- `prisma/schema.prisma`
- `prisma/migrations/0001_supabase_init/migration.sql`
- `src/lib/prisma.ts`
- `src/lib/supabase/*`
- `src/proxy.ts`
- `src/app/api/auth/*`
- `src/app/api/products/*`
- `src/app/api/orders/route.ts`
- `src/app/api/customers/route.ts`
- `src/app/api/upload/route.ts`
