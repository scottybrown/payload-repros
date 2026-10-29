# "Upcoming Events" hides a scheduled publish once its time has passed, even though it hasn't run

## Describe the Bug

The schedule drawer only lists jobs whose `waitUntil` is in the future (`buildUpcomingScheduleWhere`: `waitUntil: { greater_than: new Date() }`). A scheduled publish that is due but hasn't run yet, because the cron is minutes apart, late or broken, disappears from the drawer. It's still queued, not processing, not completed and not failed, and will publish the next time jobs run, but the author can't see it or cancel it.

We've worked around this with a custom admin component that lists the document's `schedulePublish` jobs that are neither completed nor failed, instead of filtering on `waitUntil`.

Related: #15112 has the same symptom from a different cause (an ID type mismatch on SQLite, for future jobs).

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/upcoming-events-hides-overdue

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro adds a `posts` collection with `versions: { drafts: { schedulePublish: true } }`. It sets no `jobs.autoRun`, so nothing runs jobs, which stands in for a cron that is late.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Posts > Create New, enter a title, then Save Draft.
3. Open Schedule Publish, choose Publish and a time a minute ahead, then Save. It's listed under Upcoming Events, as expected ✅
4. Wait until that time passes, then reopen Schedule Publish.

**Expected:** the scheduled publish is listed until it has run or failed, so it can be seen and deleted.

**Actual:** "No upcoming events scheduled". The post is still a draft, so the publish hasn't run, but nothing in the admin shows it or lets the author cancel it.

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
