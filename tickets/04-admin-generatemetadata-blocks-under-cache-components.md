# Admin `generateMetadata` reads runtime data, so Cache Components reports a blocked route

## Describe the Bug

With Cache Components on (`cacheComponents` and `partialPrefetching`), a signed-in load of `/admin` in `next dev` logs:

```text
Error: Route "/admin/[[...segments]]": Next.js encountered URL data in `generateMetadata()`.
This route's metadata is blocked, but the rest of its content can be prefetched. `params` or
`searchParams` accessed in `generateMetadata()` prevent it from being prefetched.
```

With `cacheComponents` alone, Next reports the same thing as "encountered runtime data in `generateMetadata()`".

The generated `app/(payload)/admin/[[...segments]]/page.tsx` exports `generateMetadata = ({ params, searchParams }) => generatePageMetadata(...)`, and `generatePageMetadata` awaits `params` and `searchParams`. The file is generated ("do not modify"), so a project can't fix it in place.

Dev only. `next build` is unaffected.

We haven't worked around this. `export const instant = false` on the route, or turning Next's check off, silences it but weakens Next's caching checks for the whole admin.

Related: #18065 covers the `initReq` / `RootLayout` errors under Cache Components. This one is only mentioned in passing in a comment there.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/admin-blocking-route-warning

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro is the blank template with `cacheComponents: true` and `partialPrefetching: true` in `next.config.ts`. Its home page is replaced with a static one so `next build` passes, which is unrelated to the bug.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Reload `/admin`.

**Expected:** no error. The admin's metadata doesn't depend on runtime data, or the generated route is dynamic in a way Next accepts.

**Actual:** the dev server logs the error above.

## Which area(s) are affected?

area: core, area: ui

## Environment Info

```text
Binaries:
  Node: 22.18.0
  npm: 10.9.3
  Yarn: N/A
  pnpm: 10.14.0
Relevant Packages:
  payload: 3.91.0
  next: 16.4.0
  @payloadcms/db-postgres: 3.91.0
  @payloadcms/drizzle: 3.91.0
  @payloadcms/graphql: 3.91.0
  @payloadcms/next/utilities: 3.91.0
  @payloadcms/richtext-lexical: 3.91.0
  @payloadcms/translations: 3.91.0
  @payloadcms/ui/shared: 3.91.0
  react: 19.2.6
  react-dom: 19.2.6
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin Kernel Version 27.0.0: Tue Aug 11 21:06:24 PDT 2026; root:xnu-13432.1.9~1/RELEASE_ARM64_T6030
  Available memory (MB): 36864
  Available CPU cores: 11
```
