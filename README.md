# D2D Web

Freelance web design showcase and lead-generation site.

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Resend · Vercel Analytics · Vercel

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
| `NEXT_PUBLIC_SITE_URL` | no | Canonical origin for OG/metadata. Leave it **unset** rather than blank if you have no domain yet; the build falls back to the Vercel production domain, then to the default in `site.ts`. |

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
    landings.ts         Audience/service landing page content
    pricing.ts          Pricing tiers
    faqs.ts             Homepage FAQs (also emitted as FAQPage schema)
    testimonials.ts     Client testimonials
    schema.ts           JSON-LD builders
```

## Content

Most page content lives in `src/lib` as typed data, not inside components,
so copy can be edited without touching JSX.

- **Portfolio** — add to `projects.ts`. An empty array automatically makes
  `/design` noindex and drops it from the sitemap; adding a project reverses
  both.
- **Landing pages** — add to `landings.ts` and the route, sitemap and footer
  links follow automatically. Each needs its own copy and FAQs: thin,
  templated variants of the same page are worse than not having them.
- **FAQs** — `faqs.ts` is rendered on the page *and* emitted as FAQPage
  schema. Google requires the two to match, so never let them diverge.

## Analytics

Vercel Analytics and Speed Insights are wired into the root layout. They
only report once deployed to Vercel — the `/_vercel/insights` endpoint does
not exist locally, so seeing no requests in `next start` is expected.

## Leads

All three forms (contact, quote, booking) post to `/api/lead`. The route validates with Zod, drops honeypot submissions silently, rate-limits per IP, emails you the lead, and sends the visitor a confirmation.
