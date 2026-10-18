# Schedule drawer says "Scheduled successfully" when scheduling failed

## Describe the Bug

`schedulePublishHandler` catches a failure and **returns** `{ error }`; it doesn't throw. The drawer's `handleSave` awaits `schedulePublish(...)`, never reads the result, and shows `version:scheduledSuccessfully` unless the call throws. So a failed schedule shows a green "Scheduled successfully." toast while nothing is queued. Deleting a scheduled event (`deleteHandler`) has the same flaw, showing `general:deletedSuccessfully`.

This also affects any project that overrides the `schedule-publish` server function and returns `{ error }` the way the stock handler does.

**Workaround:** none in place. The fix is in `ScheduleDrawer`'s compiled output, which is too large to patch sensibly.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/schedule-drawer-false-success

## Reproduction Steps

1. A `posts` collection with `versions: { drafts: { schedulePublish: true } }`.
2. To make queueing fail: `jobs.runHooks: true` and a `beforeChange` hook on the jobs collection (via `jobsCollectionOverrides`) that throws `new APIError('Scheduling is refused.', 403, undefined, true)`. This stands in for any server-side failure.
3. `pnpm dev`, sign in, create a post, Save Draft, open Schedule Publish, choose Publish and a future time, and Save.
4. A green "Scheduled successfully." toast appears. Upcoming Events is empty, no job exists, and the server logged `Error scheduling publish for document with ID … in collection posts`.

Expected: an error toast.

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
