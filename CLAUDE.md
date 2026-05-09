# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build — always run before committing code changes
npm run lint     # eslint
npm run start    # serve production build
```

No test suite is configured.

## Stack

- **Next.js 16.2.6** — App Router, Server Components by default, React 19
- **Tailwind v4** — no `tailwind.config.js`; theme lives entirely in `src/app/globals.css` under `@theme inline` and CSS custom properties
- **next-intl 4.x** — all routes under `src/app/[locale]/`; locales `es` (default) and `en`
- **Zod 4** — shared validation between client forms and the API route
- **Resend** — transactional email
- **Upstash Redis** — rate limiting (5 req / 1 h per IP) on the quote endpoint
- **shadcn/ui** components in `src/components/ui/`
- **Framer Motion** — `FadeIn` / `Stagger` scroll-reveal primitives in `src/components/sections/FadeIn.tsx`

## Architecture

### i18n

Every page is a Server Component under `src/app/[locale]/`. All pages must call `setRequestLocale(locale)` before any async work. Translations are fetched with `getTranslations(namespace)` (server) or `useTranslations(namespace)` (client). String catalogs are in `messages/es.json` and `messages/en.json` — both files must be updated together whenever a new key is added.

`localePrefix: "always"` means all URLs include the locale segment (`/es/...`, `/en/...`).

### Tailwind v4 gotcha

There is no `tailwind.config.js`. Brand tokens (`navy`, `gold`, `cream`, `charcoal`, etc.) are declared as CSS variables in `globals.css` and aliased into Tailwind via `@theme inline`. Because there is no static config file, **Tailwind only sees classes that appear as complete literal strings in scanned source files**. Classes constructed dynamically (string concatenation, array `.join()`) are not scanned. Use `style` prop for anything computed at runtime, especially positioning.

Wrap all animations in `motion-safe:` to respect `prefers-reduced-motion`.

### Quote flow

`ProvisionsQuoteFlow` (`src/components/forms/provisions-flow/`) is a 3-step client form:

1. **Vessel** — vessel + port call + contact data (`VesselContactData`)
2. **Order** — one of three methods: catalog (cart), Excel template, or file upload
3. **Review** — currency, notes, consent, submit

All submission goes to `POST /api/cotizar` (`src/app/api/cotizar/route.ts`), which accepts either JSON (catalog / MARPOL) or `multipart/form-data` (file upload). It validates against the Zod schemas in `src/lib/schemas/`, enforces rate limiting, then sends two emails via Resend — one internal, one customer confirmation.

The API distinguishes between `quoteProvisionsSchema` (legacy simple form) and `quoteProvisionsRichSchema` (3-method flow) by detecting the presence of a `method` field in the payload.

### SEO

All per-page metadata is centralized in `src/lib/seo.ts` (`PAGE_SEO` map, `buildPageMetadata`, `breadcrumbJsonLd`, `serviceJsonLd`). Every page calls `buildPageMetadata(locale, "/path")` for its `generateMetadata` export. JSON-LD is injected as a `<script>` tag in each page component, not in the layout.

### Video backgrounds

`HeroBackground` (`src/components/sections/HeroBackground.tsx`) is a `"use client"` component that:
- Always renders the poster `<img>` immediately (no hydration flash)
- Skips video entirely on mobile (`max-width: 768px`), `prefers-reduced-motion`, `saveData`, or slow connections (2G/3G)
- Loads the `<video>` lazily via `IntersectionObserver`
- Cross-fades poster → video on `canPlay`

It requires a `posterSrc` prop (images in `public/images/posters/`). Pass `priority` for above-the-fold instances (Hero section).

### Environment variables

See `.env.local.example`. Required for email to work in production:

```
RESEND_API_KEY
RESEND_TO_EMAIL
RESEND_FROM_EMAIL
NEXT_PUBLIC_SITE_URL   # used for CORS origin check in /api/cotizar
```

Without `RESEND_API_KEY` / `RESEND_TO_EMAIL`, the API returns `{ ok: true, simulated: true }` in development and a 500 in production.

### WhatsApp float button

`WhatsAppFloat` (`src/components/layout/WhatsAppFloat.tsx`) is rendered in the locale layout inside `NextIntlClientProvider`, after `<Footer />`. Its position (`fixed`, `bottom`, `right`, `z-index`) is set via `style` prop — not Tailwind — because of the v4 scanning limitation noted above.
