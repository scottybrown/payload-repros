# Multi-tenant: the assign-tenant modal opens behind a nested drawer and takes its focus

## Describe the Bug

When no tenant is selected and a tenant-scoped document is created in a drawer inside another drawer, the assign-tenant modal opens underneath that drawer. It's hidden, but its focus trap still wins, so none of the drawer's fields can be typed in.

`AssignTenantFieldModal` sets `zIndex: drawerZBase + useDrawerDepth()`, importing both from `@payloadcms/ui/elements/Drawer`. That's a separate copy of the drawer module from the prebundled `@payloadcms/ui` entry the admin's drawers use, so its depth context is never provided and the modal is always at 101. A nested drawer is at 102. One drawer deep they tie at 101 and the modal shows, which is why it only breaks when nested. The main entry doesn't export `useDrawerDepth` or `drawerZBase`, so a fix needs them exported there.

We've worked around this by forcing `.assign-tenant-field-modal` to z-index 200 with `!important`.

Related: #14727 and #10109 are similar modal and drawer problems. #17006 rewrote this modal for 4.0.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/tenant-modal-behind-nested-drawer

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro adds the multi-tenant plugin for `media`, a `tenants` collection with an `image` upload, and a `pages` collection with a `featuredTenant` relationship.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Create two tenants, `Acme` and `Beta`.
3. Create a page with Acme as its Featured Tenant.
4. On the Pages list, clear "Filter by Tenant" in the sidebar.
5. Open the page, then open Acme with the edit icon in Featured Tenant.
6. In Acme's drawer, choose Create New under Image.
7. Type in Alt.

**Expected:** the assign-tenant modal shows above the media drawer, as it does one drawer deep (Create New under Image on Acme's own edit screen) ✅

**Actual:** the modal opens behind the media drawer (z-index 101 against 102). Alt can't be focused or typed in. Alt is required, so the new media can't be saved.

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
