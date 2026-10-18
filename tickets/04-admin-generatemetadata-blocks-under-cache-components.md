# Admin `generateMetadata` reads runtime data, so Cache Components reports a blocked route

## Describe the Bug

With Cache Components on (`cacheComponents` and `partialPrefetching`), the first signed-in load of `/admin` in `next dev` logs:

```text
Error: Route "/admin/[[...segments]]": Next.js encountered URL data in `generateMetadata()`.
This route's metadata is blocked, but the rest of its content can be prefetched. `params` or
`searchParams` accessed in `generateMetadata()` prevent it from being prefetched.
```

With `cacheComponents` alone, Next reports the same thing as "encountered runtime data in `generateMetadata()`".

The generated `app/(payload)/admin/[[...segments]]/page.tsx` exports `generateMetadata = ({ params, searchParams }) => generatePageMetadata(...)`, and `generatePageMetadata` awaits `params` and `searchParams`. The file is generated ("do not modify"), so a project can't fix it in place.

Dev only. `next build` is unaffected.

**Workaround:** none we'd recommend. `export const instant = false` on the route, or turning Next's check off, silences it but weakens Next's caching checks for the whole admin.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/admin-blocking-route-warning

## Reproduction Steps

1. Blank template with `cacheComponents: true` and `partialPrefetching: true` in `next.config.ts`. The home page is replaced with a static one so `next build` passes; that's unrelated to the bug.
2. `pnpm dev`, sign in, open `/admin`.
3. The dev server logs the error above.

Expected: the admin's metadata doesn't depend on runtime data, or the generated route is dynamic in a way Next accepts.

Related: #18065 covers the `initReq` / `RootLayout` errors under Cache Components. This one is only mentioned in passing in a comment there.

## Which area(s) are affected?

area: core, area: ui

## Environment Info

```text
Binaries:
  Node: 22.18.0
  pnpm: 10.14.0
Relevant Packages:
  payload: 3.91.0
  next: 16.4.0
  @payloadcms/db-postgres: 3.91.0
  @payloadcms/ui/shared: 3.91.0
  react: 19.2.6
Operating System:
  Platform: darwin
  Arch: arm64
```
