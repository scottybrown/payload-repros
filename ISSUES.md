# Payload issues: what to file

Payload bugs found while building a Payload 3 site, triaged as of 2026-10-17. Numbers are the working
numbers used during triage. Each repro is a branch off `main` (the untouched blank template)
holding only that bug's change, with a `REPRO.md` covering steps, expected and actual
results, and the source responsible. Each link below is a compare view showing just that
branch's diff. The `hosted` branch combines the ones a deployment can show (see its
`HOSTED.md`).

Versions: Payload 3.90.2, Next 16.4.0, Postgres. The `hosted` branch uses Next 16.3.8.

## File as new issues

| # | Bug | Repro | Related | Notes |
|---|---|---|---|---|
| 1 | Reset password ignores the `password` field override: the reset screen says "minimum length of 3" and the server accepts `abc` | [reset-password-skips-validation](https://github.com/scottybrown/payload-repros/compare/main...repro/reset-password-skips-validation) | #7582 (closed, about the hook) | Workaround: patch the `password` validator's default `minLength` (`payload/dist/fields/validations.js`), which the reset path falls back to |
| 3 | Field error tooltip truncates the message, cutting off "...minimum length of ..." on the reset password screen | [password-error-truncated](https://github.com/scottybrown/payload-repros/compare/main...repro/password-error-truncated) | #16774 (vertical clipping, not the same) | Also on create-first-user |
| 4 | Admin `generateMetadata` reads runtime data, so Cache Components blocks the route's metadata (dev) | [admin-blocking-route-warning](https://github.com/scottybrown/payload-repros/compare/main...repro/admin-blocking-route-warning) | #18065 (mentioned in one comment) | Dev only. Fixes would mean editing Payload's generated `page.tsx` |
| 5 | "More versions..." drawer closes as soon as it opens | [more-versions-drawer-closes](https://github.com/scottybrown/payload-repros/compare/main...repro/more-versions-drawer-closes) | #16270 (different drawer) | Only `next dev` with `cacheComponents`; production builds are fine. Low priority |
| 6 | "Upcoming Events" hides a scheduled publish once its time has passed, even though it hasn't run | [upcoming-events-hides-overdue](https://github.com/scottybrown/payload-repros/compare/main...repro/upcoming-events-hides-overdue) | #15112 (same symptom, different cause) | Filter is `waitUntil > now` |
| 7 | Schedule drawer says "Scheduled successfully" when scheduling failed | [schedule-drawer-false-success](https://github.com/scottybrown/payload-repros/compare/main...repro/schedule-drawer-false-success) | | The stock handler returns `{ error }` and the drawer ignores it. The delete handler has the same flaw |
| 8 | Schedule drawer defaults to Unpublish on a document that has never been published | [schedule-drawer-defaults-unpublish](https://github.com/scottybrown/payload-repros/compare/main...repro/schedule-drawer-defaults-unpublish) | | Minor |
| 9 | Bulk edit offers fields marked `admin.hidden`, then renders no input for them | [bulk-edit-offers-hidden-fields](https://github.com/scottybrown/payload-repros/compare/main...repro/bulk-edit-offers-hidden-fields) | #16336 (`admin.condition`, same family) | Seen on a hook-set "Last saved by" field. Workaround: `admin.disableBulkEdit` |
| 11 | Error toasts split any message at its first colon and every comma after it, into "Heading (n):" and a list | [toast-splits-message](https://github.com/scottybrown/payload-repros/compare/main...repro/toast-splits-message) | | Low priority. Workaround: no colon and commas in error messages |

## Comment on an existing issue

| # | Bug | Repro | Issue | What to add |
|---|---|---|---|---|
| 12 | Unique-value error comes back as a raw key (`error:followingFieldsInvalid`), and Create New renders blank | [unique-error-raw-key](https://github.com/scottybrown/payload-repros/compare/main...repro/unique-error-raw-key) | #15126 | On 3.90.2 it blanks on the first Create New, not only the second. Cause of the "key not found": `initReq` loads the client-side translations, which lack those keys |

## Don't file

| # | Item | Why |
|---|---|---|
| 2 | Password minimum fixed at 3 | Not a bug. Configurable with a field override, `{ name: 'password', type: 'text', hidden: true, minLength: 8 }`, which the server and the admin create screen apply. Reset ignores it, which is #1. The override adds an unused `password` column; nothing is ever written to it. [Record of the check](https://github.com/scottybrown/payload-repros/compare/main...repro/password-minimum-not-configurable) |
| 10 | Drafts aren't validated | A configuration default (`versions.drafts.validate: false`), not a bug |
| 13 | A field condition makes its column nullable | By design: validation skips a field whose condition is false, so the column has to allow NULL. [Record of the check](https://github.com/scottybrown/payload-repros/compare/main...repro/condition-drops-not-null) |

## Already reported

| Item | Issue |
|---|---|
| `new Date()` error on signed-in admin loads in dev (Next 16.3, Cache Components) | #18065. Workaround: patch `@payloadcms/next` `initReq` to `await connection()` first |
| Restoring a draft version unpublishes the live page | #18389 |
| Two job runs can claim the same job | #18565 |
| Next 16.4 production builds turn every error into "An unknown error occurred." | #18774. Fixed, backport not yet released |
| Duplicate autosave drafts on Vercel under Cache Components | #15893 |

## Dismissed during triage

- **Scheduled unpublish validates the whole document, manual unpublish only `_status`:** minor.
- **Restore screen shows a generic error instead of the `APIError` message:** may be intentional.
- **A field with `access.update: () => false` lost its value after restores and publishes:** not a big deal, and there's no minimal repro.
- **Duplicating a document twice fails on unique fields:** not a big deal.

## Not yet decided

- **`schedule-publish` server function checks only admin access:** anyone who can log into the admin, contributors included, can queue or cancel a schedule on any document.
- **A draft save refused with field errors highlights no field:** seen in our project, never reproduced here.
