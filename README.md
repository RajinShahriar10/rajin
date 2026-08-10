# Rajin Shahriar — Portfolio & Admin CMS

A production-grade portfolio website with a full headless admin CMS.

- **Public site** — static/dynamic marketing pages under `src/app/(site)`
- **Admin CMS** — authenticated management UI under `/admin`
- **PostgreSQL via Neon** in production, **SQLite** for local development

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (`strict`) |
| Styling | Tailwind CSS v4 + CSS custom-property design tokens |
| Database | Prisma — SQLite (dev) / Neon PostgreSQL (prod) |
| Auth | Auth.js v5 (NextAuth), credentials + bcrypt |
| Animations | Motion (Framer Motion), Lenis smooth scroll |
| 3D | Three.js + React Three Fiber, isolated & lazy-loaded |
| Media | Cloudinary (upload + delivery) |
| Forms | react-hook-form + Zod v4 |
| UI primitives | Radix UI (headless) + shadcn-style wrappers |

## Architecture

```
src/
  app/
    (site)/            # public routes (grouped, no URL segment)
    admin/             # /admin/login
    admin/(protected)/ # /admin/* — gated by layout, shares AdminShell
    api/               # route handlers (auth, contact, media, revalidate)
  components/
    ui/                # headless primitives: Button, Dialog, Skeleton, Select…
    shared/            # site primitives: Reveal, PageTransition, ScrollProgress, Loading…
    public/            # page-specific public components
    admin/             # admin forms, tables, managers
  lib/
    data/              # data-access layer (server)
    validation/        # Zod schemas + resolver
    admin/actions.ts   # server actions
```

### Conventions

- **Route groups**: `(site)` and `admin/(protected)` are URL-transparent groups. `/admin/login` sits outside `(protected)` so the auth gate never wraps it.
- **Design tokens**: all colors, radii, shadows, fonts, easing, and animations are CSS variables in `globals.css`, mapped to Tailwind via `@theme inline`. Dark-first with `.light` / `.dark` overrides; `next-themes` toggles the class.
- **Error/loading boundaries**: `app/loading.tsx`, `app/error.tsx`, and `app/global-error.tsx` wrap the app and reuse `shared/loading` + `shared/error-state`.
- **3D isolation**: `public/three/hero-scene.tsx` is imported with `next/dynamic(..., { ssr: false })` inside `hero-background.tsx`, so the WebGL bundle never blocks initial render.

## Getting Started

Prerequisites: **Node.js ≥ 20** and npm.

```bash
npm install
cp .env.example .env.local   # then fill in values (see below)
npm run db:setup             # migrate + seed the local SQLite database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [`.env.example`](.env.example) for the full template. Key variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma connection string (`file:./dev.db` locally, Neon `postgresql://…?sslmode=require` in prod) |
| `AUTH_SECRET` | Auth.js signing secret (`openssl rand -base64 32`) |
| `AUTH_TRUST_HOST` | `true` for local/edge deploys |
| `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | Server-side signed uploads via the `cloudinary` SDK (`lib/cloudinary.ts`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name used by signed browser uploads |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials used by `npm run db:seed` to create the admin user |
| `REVALIDATE_SECRET` | Protects `POST /api/revalidate` (`openssl rand -hex 24`) |

## Database

### Local development (SQLite)

```bash
npm run db:migrate   # apply migrations (prisma migrate dev)
npm run db:seed      # seed admin user + content
npm run db:studio    # Prisma Studio
npm run db:reset     # reset schema + reseed
```

### Production (Neon PostgreSQL)

The production schema lives at `prisma/schema.postgres.prisma` (a Postgres-tuned variant of the SQLite schema). `postinstall`, `db:generate`, and `db:seed` pick the schema automatically from `DATABASE_URL`.

1. Create a [Neon](https://neon.tech) project and copy its pooled connection string into `DATABASE_URL`.
2. Sync the schema and push it to Neon:

```bash
npm run db:migrate:prod
```

3. Seed the admin user + content:

```bash
npm run db:seed
```

`db:migrate:prod` runs `prisma db push` (no migration history — the repo tracks the SQLite migrations for local dev). The client is generated at install time (`postinstall`).

## Cloudinary

1. Create a Cloudinary account and copy **Cloud name**, **API key**, and **API secret** into the server-side variables.
2. Set the cloud name (public) in `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

Uploads are signed server-side via `/api/media/signature` (guarded by the admin session) so the API secret never reaches the client; files land in the `rajin` folder.

## Authentication

Auth.js v5 with a credentials provider against the `User` table (`bcrypt` password hash). The `admin/(protected)/layout.tsx` calls the auth guard and redirects to `/admin/login` when unauthenticated. To change the admin password, use **Admin → Account**.

## Development Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (typecheck + lint) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:*` | Database operations (see above) |

## Production Deployment

Deploy to **Vercel** (or any Node.js host):

1. Set all environment variables in the hosting provider (use Neon for `DATABASE_URL`).
2. Set `AUTH_TRUST_HOST=true` and a stable `AUTH_SECRET`.
3. Run `npm run db:migrate:prod` and `npm run db:seed` against the Neon database before the first deploy.
4. Deploy. The build script generates the Prisma client and runs the Next.js build.

Images load from `res.cloudinary.com`; add the Neon host to any VPC/IP allow-list if required.
