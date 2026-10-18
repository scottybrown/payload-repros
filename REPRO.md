# "More versions..." drawer closes as soon as it opens, in dev with Cache Components

Payload 3.91.0, Next 16.4.0 (Turbopack), Postgres.

## Setup

- `src/collections/Posts.ts`: one text field, `versions: { drafts: true }`.
- `next.config.ts`: `cacheComponents: true`, plus `partialPrefetching: true` (Next asks for
  it to be set explicitly). `cacheComponents` alone is enough to reproduce.
- `src/app/(frontend)/page.tsx`: the template's home page is replaced with a static one,
  because it reads auth outside `<Suspense>` and fails `next build` under Cache Components.
  Unrelated to the bug.

## Steps

1. `pnpm dev`, sign in, create a post, then change its title and Save Draft until it has
   about 15 versions (the number used when this was verified).
2. Open Versions, then open the latest version.
3. Open the comparison dropdown and choose "More versions...".

## Expected

The drawer opens and lists every version to compare against.

## Actual

The drawer opens and closes within about a second, with no error in the browser console
or the server log. Authors can only compare against what's in the dropdown.

Drawer elements present after clicking "More versions...":

| Configuration | +300ms | +1s | +3s |
|---|---|---|---|
| `next dev`, `cacheComponents: true` | 2 | 0 | 0 |
| `next dev`, `cacheComponents` and `partialPrefetching` both off | 2 | 2 | 2 |
| `next build` + `next start`, both on | 2 | 2 | 2 |

So it happens only in `next dev` with Cache Components. A production build is fine,
which matches it working on a Vercel deployment.

## Prior art

#16270 "Cache components might cause full page refresh when selecting a media" is a
similar drawer problem under Cache Components, but a different drawer, and it reloads the
page rather than closing.
