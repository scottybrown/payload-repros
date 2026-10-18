# Schedule drawer defaults to Unpublish on a document that has never been published

## Describe the Bug

On a draft that has never been published, Schedule Publish opens with **Unpublish** selected, though there's nothing live to unpublish. `PublishButton` passes `defaultType: !hasNewerVersions ? 'unpublish' : 'publish'`, which only looks at whether there are newer versions, not whether the document has ever been published.

**Workaround:** none. Authors have to switch it to Publish by hand.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/schedule-drawer-defaults-unpublish

## Reproduction Steps

1. A `posts` collection with `versions: { drafts: { schedulePublish: true } }`.
2. `pnpm dev`, sign in, create a post and Save Draft. Don't publish it.
3. Open the arrow next to Publish and choose Schedule Publish. Unpublish is selected.

Expected: Publish is selected.

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
