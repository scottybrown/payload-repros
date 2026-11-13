# Multi-tenant: the assign-tenant modal opens behind a nested drawer and takes its focus, so the drawer can't be used

## Describe the Bug

When a tenant-scoped document is created in a drawer opened inside another drawer, and no tenant is selected, the plugin's assign-tenant modal opens underneath the drawer. It can't be seen, but its focus trap is the newest, so every click or keypress in the drawer sends focus back to the modal's tenant select. None of the drawer's fields can be typed in.

`AssignTenantFieldModal` sets its z-index to `drawerZBase + useDrawerDepth()`, but imports both from `@payloadcms/ui/elements/Drawer` (`packages/plugin-multi-tenant/src/components/AssignTenantFieldModal/index.client.tsx`). The drawers the admin renders come from the prebundled `@payloadcms/ui` entry, which has its own copy of the drawer code and its own depth context. Nothing provides the subpath's context, so the modal always reads its default depth of 1 and sits at z-index 101. A drawer inside another drawer is at 102. One drawer deep, the two tie at 101 and the modal, later in the page, shows on top, which is why this only appears with nested drawers.

The main `@payloadcms/ui` entry doesn't export `useDrawerDepth` or `drawerZBase`, so a fix would export them there and have the plugin import them from `@payloadcms/ui`.

We've worked around this by raising `.assign-tenant-field-modal` to z-index 200 in `custom.scss`, with `!important` to beat the inline style.

Related: #14727 (the same modal's container blocking clicks) and #10109 (the same kind of fix for the unpublish modal in drawers). #17006 rewrote this modal for 4.0; whether that fixes it is unchecked.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/tenant-modal-behind-nested-drawer

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro adds the multi-tenant plugin with `media` as its only tenant-scoped collection, and `userHasAccessToAllTenants: () => true`. Tenants have an `image` upload field (to `media`), and a `pages` collection has a `featuredTenant` relationship to tenants.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Tenants > Create New, name it `Acme` and Save. Create a second tenant, `Beta`.
3. Pages > Create New, title `Home`, choose `Acme` as Featured Tenant, and Save.
4. Go to the Pages list and clear "Filter by Tenant" in the sidebar with its ×, then open Home. Creating the tenants selected Acme there, and the modal only opens when no tenant is selected.
5. Open Acme in a drawer with the edit icon next to it in Featured Tenant. Under Image, choose Create New. The media drawer opens, inside the tenant drawer.
6. Click Alt and type.

For comparison: open Acme from Tenants instead, and choose Create New under Image. The media drawer is now one deep, and the "Assign [Untitled]" modal shows on top of it, as expected ✅

**Expected:** in step 5, the "Assign [Untitled]" modal shows above the media drawer.

**Actual:** the modal is open but hidden under the media drawer (z-index 101 against 102). Nothing can be typed in Alt, because focus keeps returning to the modal's hidden tenant select.

## Which area(s) are affected?

plugin: multi-tenant

## Environment Info

```text
Binaries:
  Node: 24.22.1
  npm: 11.19.1
  Yarn: N/A
  pnpm: 10.14.0
Relevant Packages:
  payload: 3.93.0
  next: 16.4.3
  @payloadcms/db-postgres: 3.93.0
  @payloadcms/drizzle: 3.93.0
  @payloadcms/graphql: 3.93.0
  @payloadcms/next/utilities: 3.93.0
  @payloadcms/plugin-multi-tenant: 3.93.0
  @payloadcms/richtext-lexical: 3.93.0
  @payloadcms/translations: 3.93.0
  @payloadcms/ui/shared: 3.93.0
  react: 19.2.6
  react-dom: 19.2.6
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin Kernel Version 27.0.0: Tue Aug 11 21:06:24 PDT 2026; root:xnu-13432.1.9~1/RELEASE_ARM64_T6030
  Available memory (MB): 36864
  Available CPU cores: 11
```
