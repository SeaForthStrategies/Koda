# Koda — Project Architecture

This document describes the repository structure and conventions for the Koda time-tracking SaaS application (Next.js App Router, Supabase, TypeScript).

## Directory layout

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Optional route group: login, signup, confirm-email
│   ├── (dashboard)/        # Optional route group: dashboard, admin, employee/employer dashboards
│   ├── api/                # API routes
│   │   ├── auth/           # login, signup, logout
│   │   ├── admin/          # timecards, workspace (employer)
│   │   ├── me/             # timecards (current user)
│   │   ├── employee/       # apply-join-code
│   │   ├── employer/       # create-company
│   │   ├── stripe/         # checkout, portal, webhook
│   │   └── send/           # time card email submission
│   ├── admin/              # Employer admin (timecards, join code)
│   ├── dashboard/          # Role router → employee-dashboard | employer-dashboard
│   ├── employee-dashboard/ # Employee time entries
│   ├── employer-dashboard/ # Employer review/approve entries
│   ├── join-company/       # Join by team code
│   ├── login, signup, pricing, confirm-email, auth/callback
│   ├── layout.tsx, page.tsx, loading.tsx, error.tsx, not-found.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                 # Primitive UI (button, input, card, table, etc.)
│   ├── forms/              # Auth and flow forms (PascalCase)
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── JoinCompanyForm.tsx
│   └── dashboard/          # Dashboard-specific components (PascalCase)
│       ├── DashboardHeader.tsx
│       ├── AdminHeader.tsx
│       ├── AdminDashboard.tsx
│       ├── WorkspaceJoinCode.tsx
│       ├── EmployeeDashboardClient.tsx
│       ├── EmployerDashboardClient.tsx
│       ├── WeeklyTimeCard.tsx
│       └── YourHoursCard.tsx
│
├── lib/                    # Config, auth, utilities (no direct DB from here in services)
│   ├── supabase/           # Client, server, admin, middleware
│   ├── supabase.ts         # Browser singleton client
│   ├── auth.ts             # getCurrentUser (server)
│   ├── validators.ts       # Zod schemas and inferred types
│   ├── time.ts             # formatHours, getMondayOfWeek, hoursBetweenTimestamps
│   ├── utils.ts            # cn and other helpers
│   └── workspace.ts        # Pure helpers: generateJoinCode, normalizeJoinCode, generateTeamCode
│
├── services/               # Server-side Supabase / business logic
│   └── workspace.ts        # getOrCreateWorkspaceForOwner (DB)
│
└── (optional)
    ├── hooks/              # Custom React hooks
    └── types/              # Shared TypeScript types (or re-export from validators)
```

## Conventions

- **App Router**: Routes under `app/` define URLs; route groups like `(auth)` and `(dashboard)` do not affect URLs.
- **Components**: `components/ui` for primitives; `components/forms` for form components; `components/dashboard` for dashboard-specific UI. File names use PascalCase for components.
- **Lib**: Shared utilities, Supabase client creation, auth helpers, and Zod validators. No direct Supabase mutations in `lib/` except via `supabase/` clients.
- **Services**: Server-side logic that performs Supabase queries or mutations (e.g. workspace creation). Used by API routes and server components.
- **Imports**: Use the `@/` alias (maps to `src/`) for all internal imports.

## Data flow

- **Auth**: Supabase Auth; `getCurrentUser()` in `lib/auth.ts` for server-side checks; layouts/pages redirect unauthenticated users.
- **Time entries**: Stored in Supabase; employee dashboard submits via client Supabase; employer dashboard and admin timecards via API routes using server/admin clients.
- **Workspaces**: Employer workspace (join code) created on first employer login via `services/workspace.getOrCreateWorkspaceForOwner`; join code and team code helpers live in `lib/workspace.ts`.

No application logic was changed in this layout; only file organization and import paths were updated for clarity and portfolio review.
