# Tech Stack

## Framework & Runtime

- **Nuxt 4** (SSR enabled, `ssr: true`) — full-stack framework
- **Vue 3** with Composition API and `<script setup>`
- **TypeScript** throughout (frontend and server)
- **Node.js 20.x** required

## Backend (Nitro / Server)

- Nitro server with Vercel preset (`nitro.preset: 'vercel'`)
- API routes in `server/api/` using Nuxt's file-based routing conventions
- File naming: `[resource]/index.get.ts`, `[resource]/[id].patch.ts`, etc.
- Auth via custom JWT (`jsonwebtoken`) stored in httpOnly cookies
- CSRF protection middleware applied to all mutating endpoints
- `serverSupabaseServiceRole` used server-side (bypasses RLS — handle carefully)

## Frontend

- **Tailwind CSS** via `@nuxtjs/tailwindcss` — custom `qualitec`, `industrial`, `safety`, `primary` color palettes defined in `tailwind.config.ts`
- **@heroicons/vue** for icons
- **motion-v** for animations
- **@vueuse/core** for composable utilities
- **emoji-picker-element** for emoji support in avisos

## Database

- **Supabase** (PostgreSQL) via `@nuxtjs/supabase`
- RLS (Row Level Security) enabled — always use `serviceRoleKey` server-side for admin operations
- Schema migrations tracked in `database/` folder as numbered SQL files

## Auth

- Custom JWT auth (not Supabase Auth)
- Access token + refresh token pair stored in httpOnly cookies
- `server/utils/authMiddleware.ts` exports `requireAuth`, `requireAdmin`, `requireOwnershipOrAdmin`
- Always call `requireAuth(event)` or `requireAdmin(event)` at the top of protected API handlers

## Email

- **Nodemailer** with SMTP (Gmail) for sending holerites and access credentials

## PDF

- **pdfkit** for holerite PDF generation

## Key Environment Variables

```
SUPABASE_URL
SUPABASE_ANON_KEY
NUXT_PUBLIC_SUPABASE_URL
NUXT_PUBLIC_SUPABASE_KEY
SUPABASE_SERVICE_ROLE_KEY   # server-only, never expose to client
JWT_SECRET
JWT_REFRESH_SECRET
CRON_SECRET                 # used to authenticate cron job calls
EMAIL_HOST / EMAIL_PORT / EMAIL_USER / EMAIL_PASS
NUXT_PUBLIC_BASE_URL
```

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Generate static site (not typical for this app)
npm run generate

# Prepare Nuxt (run after install)
npm run postinstall
```

## Testing

- Tests located in `server/utils/__tests__/` (e.g., `dateUtils.test.ts`)
- No test runner is explicitly configured in `package.json` — check for vitest or jest config if adding tests
