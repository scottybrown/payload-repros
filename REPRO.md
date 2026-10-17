# Admin's generateMetadata blocks the route under Cache Components

Payload 3.90.2, Next 16.4.0 (Turbopack, dev), Postgres.

## Setup

- `next.config.ts`: `cacheComponents: true`, plus `partialPrefetching: true` (Next asks for it
  to be set explicitly). `cacheComponents` alone is enough to reproduce.
- `src/app/(frontend)/page.tsx`: the template's home page is replaced with a static one,
  because it reads auth outside `<Suspense>` and fails `next build` under Cache Components.
  Unrelated to the bug.

## Steps

1. `pnpm dev`, sign in, open `/admin`.
2. Read the dev server's terminal.

## Actual

```text
GET /admin 200
Error: Route "/admin/[[...segments]]": Next.js encountered runtime data in `generateMetadata()`.

This route's metadata is blocked, but the rest of its content can be prerendered. `cookies()`,
`headers()`, `params`, or `searchParams` accessed in `generateMetadata()` cause it to run dynamically.

Learn more: https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime
```

The generated `app/(payload)/admin/[[...segments]]/page.tsx` exports
`generateMetadata = ({ params, searchParams }) => generatePageMetadata({ config, params, searchParams })`.
`generatePageMetadata` awaits `params` and `searchParams`, which Cache Components treats as
runtime data. The template is generated, so a project can't fix this without editing
Payload's own file.

The only workarounds turn Next's checks off for the admin route (`export const instant = false`,
or turning the check off). Both weaken Next's caching checks for everything under it.

Dev only. `pnpm build` is unaffected.

## Expected

The admin's metadata either doesn't depend on runtime data, or the generated route marks
itself dynamic in a way Next accepts.

## Prior art

#18065 "Errors on Admin during development from Next JS 16.3 with Cache Components
Enabled" is about the `new Date()` / uncached-data errors in `initReq` and `RootLayout`.
This `generateMetadata` warning is only mentioned in passing in one comment there
(on 4.0 canary). The same run also shows #18065's RootLayout "uncached data" error;
this repro is only about the metadata one.
