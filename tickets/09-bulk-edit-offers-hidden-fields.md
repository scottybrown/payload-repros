# Bulk edit offers fields marked `admin.hidden`, then renders no input for them

## Describe the Bug

A field with `admin: { hidden: true }` is hidden from the edit view, but bulk edit's "Select fields to edit" still lists it. Selecting it renders no input at all, just an empty drawer with Save. We hit this with a "Last saved by" field that a hook sets.

**Workaround:** `admin.disableBulkEdit: true` on every hidden field.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/bulk-edit-offers-hidden-fields

## Reproduction Steps

1. A `posts` collection with `title`, and `lastSavedBy` (label "Last saved by") with `admin: { hidden: true }`.
2. `pnpm dev`, sign in, create two posts. Their edit view shows only Title.
3. In the Posts list, select all, click Edit, and open "Select fields to edit". "Last saved by" is offered.
4. Select it. No input renders.

Expected: hidden fields aren't offered.

Related: #16336 covers bulk edit and `admin.condition`, the same family of problem.

## Which area(s) are affected?

area: ui

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
