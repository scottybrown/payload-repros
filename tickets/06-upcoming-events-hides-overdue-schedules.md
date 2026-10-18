# "Upcoming Events" hides a scheduled publish once its time has passed, even though it hasn't run

## Describe the Bug

The schedule drawer only lists jobs whose `waitUntil` is in the future (`buildUpcomingScheduleWhere`: `waitUntil: { greater_than: new Date() }`). A scheduled publish that is due but hasn't run yet, because the cron is minutes apart, late or broken, disappears from the drawer. It's still queued, not processing, not completed and not failed, and will publish the next time jobs run, but the author can't see it or cancel it.

**Workaround:** a custom admin component that lists the document's `schedulePublish` jobs that are neither completed nor failed, instead of filtering on `waitUntil`.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/upcoming-events-hides-overdue

## Reproduction Steps

1. A `posts` collection with `versions: { drafts: { schedulePublish: true } }`. No `jobs.autoRun`, so nothing runs jobs until `/api/payload-jobs/run` is called.
2. `pnpm dev`, sign in, create a post, Save Draft.
3. Schedule Publish: choose Publish and a time a minute ahead, then Save. It's listed under Upcoming Events.
4. Wait until that time passes, then reopen Schedule Publish: "No upcoming events scheduled".
5. The job is still in `payload_jobs` with `processing = false`, `completed_at = null` and `has_error = false`.

Expected: the job is listed until it has run or failed, so it can be seen and deleted.

Related: #15112 has the same symptom from a different cause (an ID type mismatch on SQLite, for future jobs).

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
