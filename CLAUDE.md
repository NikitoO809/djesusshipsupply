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

- **Next.js 16.4.6** — App Router, Server Components by default, React 19
- **Tailwind v4** — no `tailwind.config.js`; theme lives entirely in `src/app/globals.css` under `@theme inline` and CSS custom properties
- **next-intl 4.x** — all routes under `src/app/[locale]/`; locales `es` (default) and `en`
- **shadcn/ui** components in `src/components/ui/`
- **Framer Motion** — `FadeIn` / `Stagger` scroll-reveal primitives in `src/components/sections/FadeIn.tsx`

## Architecture

### i18n

Every page is a Server Component under `src/app/[locale]/`. All pages must call `setRequestLocale(locale)` before any async work. Translations are fetched with `getTranslations(namespace)` (server) or `useTranslations(namespace)` (client). String catalogs are in `messages/es.json` and `messages/en.json` — both files must be updated together whenever a new key is added.

`localePrefix: "always"` means all URLs include the locale segment (`/es/...`, `/en/...`).

### Tailwind v4 gotcha

There is no `tailwind.config.js`. Brand tokens (`navy`, `gold`, `cream`, `charcoal`, etc.) are declared as CSS variables in `globals.css` and aliased into Tailwind via `@theme inline`. Because there is no static config file, **Tailwind only sees classes that appear as complete literal strings in scanned source files**. Classes constructed dynamically (string concatenation, array `.join()`) are not scanned. Use `style` prop for anything computed at runtime, especially positioning.

Wrap all animations in `motion-safe:` to respect `prefers-reduced-motion`.

### Cotizaciones (sin formulario)

La web **no tiene formularios, API de correo ni backend**: es 100 % estática/SSG. Las cotizaciones llegan por correo (`ops@` / `info@djshipsupply.com`, que reenvían a Gmail vía Cloudflare Email Routing) o por WhatsApp. Todos los botones "Cotizar…" del sitio llevan a `/contacto`, donde un botón `mailto:` abre un correo con la plantilla de MARPOL ya escrita (`contact.mailSubject` / `contact.mailBody` en `messages/`).

Retirado en el mantenimiento de nov-2026: catálogo, cotizador de provisiones, procurement, carrito/RFQ, formulario MARPOL, `/api/cotizar`, Resend, Upstash, ExcelJS, ERP y n8n. Estas URLs redirigen (308) a `/contacto`: `/suministro`, `/procurement/*`, `/cotizar/provisiones`, `/cotizar/desechos` (ver `redirects()` en `next.config.ts`). El historial de git conserva todo ese código si hiciera falta recuperarlo.

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

Ya no se necesita ninguna para que la web funcione. `.env.local.example` solo lista `SITE_URL`/`NEXT_PUBLIC_SITE_URL`, los datos de contacto públicos y la verificación de Google Search Console.

### WhatsApp float button

`WhatsAppFloat` (`src/components/layout/WhatsAppFloat.tsx`) is rendered in the locale layout inside `NextIntlClientProvider`, after `<Footer />`. Its position (`fixed`, `bottom`, `right`, `z-index`) is set via `style` prop — not Tailwind — because of the v4 scanning limitation noted above.
