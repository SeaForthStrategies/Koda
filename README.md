# Koda

Weekly time tracking as a service. Submit time cards by week, get them by email. Secure auth, optional billing.

## Features

- **Auth** – Sign up / sign in with email and password (Supabase Auth)
- **Weekly time cards** – Check days, enter hours and details, submit; emails sent via Resend
- **Security** – Per-submit verification (type displayed numbers)
- **Billing** – Stripe Checkout for Pro plan; customer portal to manage subscription
- **Persistence** – Time card submissions stored in Supabase (`time_cards` table)

## Stack

- **Next.js 15** (App Router)
- **Supabase** – Auth + Postgres (profiles, time_cards)
- **Resend** – Transactional email
- **Stripe** – Subscriptions and customer portal
- **Tailwind CSS**, **Radix UI**, **Zod**

## Setup

### 1. Install and env

```bash
pnpm install
cp .env.example .env.local
```

### 2. Supabase

- Create a project at [supabase.com](https://supabase.com).
- In **Settings → API**: copy **Project URL** into `NEXT_PUBLIC_SUPABASE_URL` and **anon public** key into `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
- In **Authentication → URL Configuration**, add your redirect URL: `http://localhost:3000/auth/callback` (and your production URL) so email confirmation links work.
- In **SQL Editor**, run the migration: `supabase/migrations/001_initial.sql`.
- (Optional) To auto-create profiles on signup, run in SQL Editor:
  ```sql
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
  ```

### 3. Resend

- Create an API key at [resend.com](https://resend.com) and set `RESEND_API_KEY`.
- Set `EMAIL_FROM` to a verified domain (e.g. `timecards@yourdomain.com`).

### 4. Stripe (optional)

- Create a product and recurring price in Stripe Dashboard.
- Put the price ID in `STRIPE_PRICE_ID_PRO`, and the secret key in `STRIPE_SECRET_KEY`.
- For customer portal and webhooks, set `STRIPE_WEBHOOK_SECRET` and point the webhook to `https://your-domain/api/stripe/webhook`.

### 5. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (or http://127.0.0.1:3000) in your browser. You’ll see the landing page; use **Get started** to sign up, then **Dashboard** for the time card. If you can’t connect, ensure nothing else is using port 3000 and run `pnpm dev` again.

## Project structure

- **`src/app`** — Next.js App Router (pages, layouts, API routes).
- **`src/components`** — `ui/` (primitives), `forms/` (LoginForm, SignupForm, JoinCompanyForm), `dashboard/` (headers, AdminDashboard, Employee/EmployerDashboardClient, etc.).
- **`src/lib`** — Supabase clients, auth, validators (Zod), time utils, workspace helpers.
- **`src/services`** — Server-side Supabase logic (e.g. workspace creation).

See **`docs/ARCHITECTURE.md`** for the full layout and conventions.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing (hero, features, pricing CTA) |
| `/login` | Sign in |
| `/signup` | Create account |
| `/dashboard` | Weekly time card (requires auth) |
| `/confirm-email` | Instructions after signup when email confirmation is required |
| `/auth/callback` | Handles email confirmation link from Supabase (set as Redirect URL in Supabase) |
| `/pricing` | Plans and Subscribe (Stripe Checkout) |

## Deploy (Vercel)

1. **Push to GitHub** and import the repo in [Vercel](https://vercel.com). Vercel will detect Next.js and use the default build (`pnpm run build`).

2. **Environment variables** — In the Vercel project, go to **Settings → Environment Variables** and add all keys from `.env.example` (and any optional ones you use). Use the same names; no prefix needed.

3. **Supabase** — Use your production Supabase project. In **Authentication → URL Configuration**, add your Vercel URL (e.g. `https://your-app.vercel.app`) and `https://your-app.vercel.app/auth/callback` as redirect URLs.

4. **Stripe** — Use production keys and set the webhook endpoint to `https://your-app.vercel.app/api/stripe/webhook`.

5. **Migrations** — Run your Supabase migrations against the production database if you haven’t already.

The app is responsive and tuned for mobile, tablet, and desktop (touch targets, safe areas, horizontal scroll for tables).
