# Schedule drawer defaults to Unpublish on a document that has never been published

## Describe the Bug

On a draft that has never been published, Schedule Publish opens with **Unpublish** selected, though there's nothing live to unpublish. `PublishButton` passes `defaultType: !hasNewerVersions ? 'unpublish' : 'publish'`, which only looks at whether there are newer versions, not whether the document has ever been published.

We haven't worked around this. Authors have to switch it to Publish by hand.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/schedule-drawer-defaults-unpublish

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro adds a `posts` collection with `versions: { drafts: { schedulePublish: true } }`.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Posts > Create New, enter a title, then Save Draft. Don't publish it.
3. Open the arrow next to Publish and choose Schedule Publish.

**Expected:** Publish is selected.

**Actual:** Unpublish is selected.

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
