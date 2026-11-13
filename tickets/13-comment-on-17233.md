# Comment for #17233 ("Create New" form immediately closes/redirects after "Leave anyway")

Still happening on Payload 3.93.0 with Next 16.4.3. On 3.92.1 we could only reproduce it with Cache Components on: on the blank template, Create New stays open, and with `cacheComponents: true` it bounces back to the list.

**Cause:** under Cache Components, Next keeps the page you leave hidden instead of unmounting it, and shows the same instance when you return. `usePreventLeave` (`packages/ui/src/elements/LeaveWithoutSaving/usePreventLeave.tsx`) never clears `cancelledURL.current` after following it, and `hasAccepted` stays true. When the hidden page is shown again, its effect runs again and pushes the list URL a second time.

**Fix:** clear `cancelledURL.current` once it has been followed, as #17398 did before its author closed it. #18702 avoids all of this on 4.0 by unmounting hidden admin pages, but it isn't in 3.x.

**Note:** when we fixed it by clearing the URL alone, it caused a second bug. After one "Leave anyway", opening another document, editing it and choosing "Leave anyway" again did nothing, and the user was stuck on that document. The revived page still had `hasAccepted` set to true, so accepting again didn't change state and the effect never ran. Resetting `hasAccepted` in `LeaveWithoutSaving` after each leave fixed that as well.

We've worked around this with a pnpm patch to `@payloadcms/ui` that does both. The prebundled copy in `dist/exports/client/index.js` needs the same change, because that's the file Next loads.

**Reproduction:** https://github.com/scottybrown/payload-repros/tree/repro/leave-anyway-bounces-create-new (the blank template on 3.93.0 with `cacheComponents: true`).

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Users > Create New, and type any email.
3. Click Users in the sidebar, then Leave anyway. The Users list opens, as expected ✅
4. Click Create New.

**Expected:** the create screen stays open.

**Actual:** the create screen opens, then goes straight back to the Users list. The server log shows `GET /admin/collections/users/create` followed by `GET /admin/collections/users`.
