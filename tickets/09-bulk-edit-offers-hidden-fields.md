# Bulk edit offers fields marked `admin.hidden`, then renders no input for them

## Describe the Bug

A field with `admin: { hidden: true }` is hidden from the edit view, but bulk edit's "Select fields to edit" still lists it. Selecting it renders no input at all, just an empty drawer with Save. We hit this with a "Last saved by" field that a hook sets.

We've worked around this with `admin.disableBulkEdit: true` on each hidden field.

Related: #16336 covers bulk edit and `admin.condition`, the same family of problem.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/bulk-edit-offers-hidden-fields

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro adds a `posts` collection with `title`, and `lastSavedBy` (label "Last saved by") with `admin: { hidden: true }`.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Create two posts. Their edit view shows only Title, as expected ✅
3. In the Posts list, select all, click Edit, and open "Select fields to edit".
4. Select "Last saved by".

**Expected:** hidden fields aren't offered.

**Actual:** "Last saved by" is offered in step 3, and selecting it renders no input, just an empty drawer with Save.

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
