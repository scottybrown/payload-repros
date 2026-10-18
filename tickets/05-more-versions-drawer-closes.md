# "More versions..." drawer closes as soon as it opens (dev, Cache Components)

## Describe the Bug

On the version compare screen, choosing "More versions..." opens the drawer, which closes within about a second. There's no error in the browser console or the server log, so authors can only compare against the versions in the dropdown.

It only happens in `next dev` with `cacheComponents: true`:

| Configuration | Drawer open after 3s |
|---|---|
| `next dev`, `cacheComponents: true` | No |
| `next dev`, Cache Components off | Yes |
| `next build` + `next start`, `cacheComponents: true` | Yes |

**Workaround:** none. Production builds aren't affected.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/more-versions-drawer-closes

## Reproduction Steps

1. A `posts` collection with `versions: { drafts: true }`, and `cacheComponents: true` in `next.config.ts`.
2. `pnpm dev`, sign in, create a post and save 15 drafts of it.
3. Open Versions, then the latest version.
4. Open the comparison dropdown and choose "More versions...". The drawer opens and closes.

Expected: the drawer stays open and lists the versions.

Related: #16270 is a drawer problem under Cache Components too, but a different drawer.

## Which area(s) are affected?

area: ui

## Environment Info

```text
Binaries:
  Node: 22.18.0
  pnpm: 10.14.0
Relevant Packages:
  payload: 3.90.2
  next: 16.4.0
  @payloadcms/db-postgres: 3.90.2
  @payloadcms/ui/shared: 3.90.2
  react: 19.2.6
Operating System:
  Platform: darwin
  Arch: arm64
```
