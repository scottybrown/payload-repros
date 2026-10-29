# "More versions..." drawer closes as soon as it opens (dev, Cache Components)

## Describe the Bug

On the version compare screen, choosing "More versions..." opens the drawer, which closes within about a second. There's no error in the browser console or the server log, so authors can only compare against the versions in the dropdown.

It only happens in `next dev` with `cacheComponents: true`:

| Configuration | Drawer open after 3s |
|---|---|
| `next dev`, `cacheComponents: true` | No |
| `next dev`, Cache Components off | Yes |
| `next build` + `next start`, `cacheComponents: true` | Yes |

We haven't worked around this. Production builds aren't affected.

Related: #16270 is a drawer problem under Cache Components too, but a different drawer.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/more-versions-drawer-closes

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro adds a `posts` collection with `versions: { drafts: true }`, and sets `cacheComponents: true` in `next.config.ts`.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Posts > Create New, then save 15 drafts of the post.
3. Open Versions, then the latest version.
4. Open the comparison dropdown and choose "More versions...".

**Expected:** the drawer stays open and lists the versions.

**Actual:** the drawer opens, then closes within about a second, with no error.

## Which area(s) are affected?

area: ui

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
