# Hosted repros

One deployment showing the repros a production build can show, each in its own
collection so they don't interfere. Every repro also has its own minimal branch
(`repro/*`, off `main`), which is what an issue should link to.

Payload 3.90.2, Next 16.3.8, Postgres. Next is 16.3.8 here, not 16.4.0 as on the repro
branches, because Next 16.4 production builds turn every error message into
"An unknown error occurred." (payloadcms/payload#18774, fix not yet released). That
would hide repro 11.

## Deploying

- Vercel runs `vercel-build`: `payload migrate`, then `next build`.
- Environment: `DATABASE_URL` (Supabase transaction pooler, port 6543) and `PAYLOAD_SECRET`.
- No cron is configured, so scheduled jobs never run. Repro 6 depends on that.

Sign up as the first user at `/admin`.

## Repros

| # | Where | Do this | See this | Branch |
|---|---|---|---|---|
| 2 | Users > Create New | Password `abc` | Accepted. The minimum is fixed at 3 and isn't configurable | `repro/password-minimum-not-configurable` |
| 3 | Users > Create New | Password `ab`, Save | The error tooltip is cut off before the number | `repro/password-error-truncated` |
| 8 | Scheduled Posts | Create, Save Draft, then the arrow by Publish > Schedule Publish | Unpublish is preselected on a page that was never published | `repro/schedule-drawer-defaults-unpublish` |
| 6 | Scheduled Posts | Schedule a publish a minute ahead, wait, reopen the drawer | "No upcoming events", though the job is still queued | `repro/upcoming-events-hides-overdue` |
| 7 | Refused Schedule Posts | Schedule a publish | "Scheduled successfully." Nothing was scheduled: the jobs collection refused it | `repro/schedule-drawer-false-success` |
| 9 | Bulk Edit Posts | Create two, select all, Edit, open the field list | "Last saved by" (`admin.hidden`) is offered, and renders no input | `repro/bulk-edit-offers-hidden-fields` |
| 11 | Toast Posts | Create, Save | "Refused (3):" and a list, cut from one message at its colon and commas | `repro/toast-splits-message` |
| 12 | Unique Autosave Posts | Create New | Blank screen. Comment on #15126 rather than filing new | `repro/unique-error-raw-key` |

Not shown here:

- **1 (reset password):** needs the reset token, which is only in the database.
- **4 and 5:** only happen in `next dev` with Cache Components.
- **13:** by design.

See those branches.
