# Project Structure

## Top-Level Layout

```
app/          # Frontend (Nuxt app directory)
server/       # Backend (Nitro API routes + utilities)
database/     # SQL migration files (numbered, run in order)
plugins/      # Nuxt client-side plugins
public/       # Static assets
scripts/      # One-off Node.js scripts for data fixes/diagnostics
docs/         # Internal documentation (not served)
```

## Frontend: `app/`

```
app/
├── pages/              # File-based routing
│   ├── admin/          # Admin-only pages (protected by admin middleware)
│   └── ...             # Employee-facing pages
├── components/
│   ├── ui/             # Reusable UI primitives (UiButton, UiModal, UiInput, etc.)
│   ├── funcionarios/   # Employee-specific components
│   ├── holerites/      # Payslip components
│   ├── avisos/         # Announcements/notices components
│   ├── admin/          # Admin notification panels
│   ├── dashboard/      # Dashboard cards
│   └── layout/         # Sidebar, nav links, mobile menu
├── composables/        # Vue composables (useAuth, useHolerites, useNotificacoes, etc.)
├── layouts/            # default.vue layout
├── middleware/         # auth.ts and admin.ts route guards
├── types/              # TypeScript types (database.types.ts)
├── utils/              # Frontend utilities (cn.ts for classnames, z-index.ts)
└── assets/css/         # Global CSS (main.css)
```

## Backend: `server/`

```
server/
├── api/
│   ├── auth/           # login, logout, refresh, validate, forgot/reset password
│   ├── funcionarios/   # CRUD + meus-dados endpoints
│   ├── holerites/      # Generate, send email, list, patch, delete
│   ├── avisos/         # Announcements CRUD + comments
│   ├── notificacoes/   # Notifications CRUD
│   ├── empresas/       # Companies CRUD
│   ├── departamentos/  # Departments
│   ├── cargos/         # Job titles
│   ├── jornadas/       # Work schedules
│   ├── dashboard/      # Stats + birthday data
│   ├── cron/           # Cron job endpoints (protected by CRON_SECRET)
│   └── ...             # health, csrf-token, consulta-cnpj
└── utils/
    ├── authMiddleware.ts   # requireAuth, requireAdmin, requireOwnershipOrAdmin
    ├── jwt.ts              # Token generation/verification
    ├── auth.ts             # Password hashing/verification
    ├── csrfMiddleware.ts   # CSRF protection
    ├── cronMiddleware.ts   # Cron secret validation
    ├── notifications.ts    # Notification helpers
    ├── email.ts            # Nodemailer email sending
    ├── holeriteHTML.ts     # HTML template for payslips
    ├── holeritePDF.ts      # PDF generation
    ├── inss2026.ts         # INSS calculation tables for 2026
    ├── dateUtils.ts        # Date utilities
    └── config.ts           # Server config helpers
```

## Naming Conventions

- **API files**: `[method].ts` suffix — e.g., `index.get.ts`, `index.post.ts`, `[id].patch.ts`, `[id].delete.ts`
- **Components**: PascalCase, prefixed by domain — e.g., `FuncionarioCard.vue`, `UiButton.vue`
- **Composables**: camelCase with `use` prefix — e.g., `useAuth.ts`, `useHolerites.ts`
- **UI primitives**: always prefixed with `Ui` — e.g., `UiModal`, `UiInput`, `UiBadge`

## Key Patterns

- All protected API routes call `requireAuth(event)` or `requireAdmin(event)` at the start
- Composables are split by concern when large (e.g., `useHolerites`, `useHoleritesCalculo`, `useHoleritesData`, `useHoleritesFormat`)
- `useState` is used for shared reactive state across components (e.g., `useState<User | null>('auth-user', ...)`)
- Z-index values follow a strict policy defined in `app/utils/z-index.ts` and `tailwind.config.ts`
- Database migrations are numbered SQL files in `database/` — always add new ones with the next number in sequence
