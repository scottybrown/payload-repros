# Unique-value error comes back as a raw translation key (and Create New renders blank)

Payload 3.91.0, Next 16.4.0, Postgres. **Largely covered by #15126** - better added there
as a comment than filed new.

## Setup

`src/collections/Posts.ts`: `versions: { drafts: { autosave: true } }` and one text field
with `unique: true, defaultValue: ''`.

## Steps

1. `pnpm dev`, sign in, open Posts > Create New.

## Actual

The edit screen renders blank (header only), on the **first** Create New, with no posts
other than the one Create New just made. The server log:

```text
GET /admin/collections/posts/create 307
key not found: error:valueMustBeUnique
key not found: error:followingFieldsInvalid
INFO: error:followingFieldsInvalid title
```

![Blank create screen](create-new-blank.png)

The draft Create New creates on the spot has `title = ''`. The create screen then
collides with that draft's empty title. The resulting error is built with keys missing
from the request's translations, so its message is the raw `error:followingFieldsInvalid title`.

A plain Save of a duplicate title, without autosave, shows "Value must be unique"
correctly, so the missing keys only show on this path.

## Why the keys are missing (from source, not yet proven)

- The Postgres adapter builds its duplicate-value error with `req.t('error:valueMustBeUnique')`
  (`@payloadcms/drizzle` `handleUpsertError.js`).
- Admin requests set up in `@payloadcms/next` `initReq.js` use the client-side translation
  set, which leaves those two `error:*` keys out.

## What #15126 doesn't say

- On 3.91.0 it blanks on the first Create New, not only the second.
- Where the "key not found" comes from (the two points above).
