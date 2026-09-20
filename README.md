# D2D Web

Freelance web design showcase and lead-generation site.

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Resend · Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Environment variables

Set these in `.env.local` locally, and in Vercel → Project → Settings → Environment Variables for deployments.

| Variable | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | yes | From resend.com/api-keys |
| `RESEND_FROM_EMAIL` | yes | Must be on a domain verified in Resend |
| `LEAD_INBOX` | no | Where leads land; defaults to `site.contactEmail` |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical origin for OG/metadata |

Without the Resend variables the site still builds and renders — the lead form returns a friendly "not configured yet" error.

## Structure

```
src/
  app/
    layout.tsx          Root layout, fonts, base metadata
    (site)/             Public pages sharing nav + footer
    api/lead/route.ts   Single endpoint for contact/quote/booking
  components/           UI primitives and forms
  lib/
    site.ts             Site-wide constants (name, URL, services)
    lead.ts             Zod schema shared by client and server
    projects.ts         Portfolio entries
```

## Leads

All three forms (contact, quote, booking) post to `/api/lead`. The route validates with Zod, drops honeypot submissions silently, rate-limits per IP, emails you the lead, and sends the visitor a confirmation.
