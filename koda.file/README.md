# ⏱ Koda — Time Tracking

A secure, modern weekly time-tracking application built with **Next.js 14**, **Tailwind CSS**, **shadcn/ui**, and **TypeScript**.

![Koda Preview](https://via.placeholder.com/900x500/0a0a0f/7c6af7?text=Koda+Time+Tracking)

## ✨ Features

- **Weekly Time Card Dashboard** — Toggle days, set clock-in/out, add descriptions
- **Real-time Calculations** — Daily totals and weekly grand total via `useMemo`
- **Visual Analytics** — Mini bar chart showing daily hours at a glance
- **Bot Protection** — Honeypot field on login form (Cloudflare Turnstile ready)
- **Session Handling** — Client-side session with 8-hour expiry
- **Email Submission** — POST `/api/send` generates a clean HTML email via Nodemailer
- **Multi-recipient** — Add comma-separated CC recipients
- **Legal Notice** — Non-editable accuracy certification on every submission
- **Dark Mode** — Full dark-first design with glassmorphism cards
- **Form Validation** — Zod schemas on all inputs

## 🚀 Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your SMTP credentials

# 3. Run development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Login
- **Email:** `demo@koda.app`
- **Password:** `koda2025`

## 📁 Project Structure

```
koda/
├── app/
│   ├── api/send/route.ts     # Email submission API
│   ├── dashboard/page.tsx    # Main time card UI
│   ├── login/page.tsx        # Auth page with honeypot
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── KodaLogo.tsx          # Branding component
│   ├── TimeRow.tsx           # Single day row (responsive)
│   ├── WeeklyTotal.tsx       # Summary card with mini chart
│   ├── SubmitFooter.tsx      # Recipients + submit + legal note
│   └── Toast.tsx             # Notification system
├── lib/
│   ├── utils.ts              # Time calc, formatting, email HTML
│   ├── auth.ts               # Session management
│   └── schemas.ts            # Zod validation schemas
├── types/index.ts            # TypeScript interfaces
├── .env.example              # Environment template
└── README.md
```

## 🔒 Security

| Feature | Implementation |
|---------|---------------|
| Bot protection | Honeypot field (invisible to humans, traps bots) |
| Session handling | `sessionStorage` with 8h expiry |
| Input validation | Zod schemas on all forms and API routes |
| Route protection | Client-side redirect if no session |
| Email injection | All inputs sanitized via Zod before SMTP |

> **Production note:** Replace the demo credential check with a real auth provider (NextAuth, Clerk, Auth0) and a database lookup.

## 📧 Email Setup

The app supports any SMTP provider:

| Provider | Host | Notes |
|----------|------|-------|
| Gmail | smtp.gmail.com | Use App Passwords |
| SendGrid | smtp.sendgrid.net | user=`apikey` |
| Resend | smtp.resend.com | user=`resend` |
| Mailgun | smtp.mailgun.org | — |

If SMTP is not configured, submissions are logged to the console in development.

## ▲ Deploy on Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. **Root Directory:** If the repo root is not this app, set **Root Directory** to `koda.file` in Project Settings.
3. **Build & install:** Vercel will use `pnpm install` and `pnpm run build` (see `vercel.json`).
4. **Environment variables** (optional, for email): add in Vercel → Settings → Environment Variables:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`
5. Deploy. The app runs without SMTP (submissions are recorded but not emailed unless env vars are set).

## 🎨 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Zod** — schema validation
- **Nodemailer** — email delivery
- **Lucide React** — icons
- **Syne + DM Sans** — typography

## 📄 License

MIT
