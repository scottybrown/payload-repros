# Schedule drawer says "Scheduled successfully" when scheduling failed

## Describe the Bug

`schedulePublishHandler` catches a failure and **returns** `{ error }`; it doesn't throw. The drawer's `handleSave` awaits `schedulePublish(...)`, never reads the result, and shows `version:scheduledSuccessfully` unless the call throws. So a failed schedule shows a green "Scheduled successfully." toast while nothing is queued. Deleting a scheduled event (`deleteHandler`) has the same flaw, showing `general:deletedSuccessfully`.

This also affects any project that overrides the `schedule-publish` server function and returns `{ error }` the way the stock handler does.

We haven't worked around this. The fix belongs in `ScheduleDrawer`'s compiled output, which is too large to patch sensibly.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/schedule-drawer-false-success

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro adds a `posts` collection with `versions: { drafts: { schedulePublish: true } }`. To make queueing fail, it sets `jobs.runHooks: true` and adds a `beforeChange` hook on the jobs collection (through `jobsCollectionOverrides`) that throws `new APIError('Scheduling is refused.', 403, undefined, true)`. That stands in for any server-side failure.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Posts > Create New, enter a title, then Save Draft.
3. Open Schedule Publish, choose Publish and a future time, then Save.

**Expected:** an error toast.

**Actual:** a green "Scheduled successfully." toast. Upcoming Events is empty, and the server logged `Error scheduling publish for document with ID … in collection posts`.

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
