# Error toasts split any message at its first colon and every comma after it

## Describe the Bug

`createErrorsFromMessage` (`@payloadcms/ui` `elements/Toasts/fieldErrors.js`) parses every error toast as if it were Payload's "The following fields are invalid: a, b" message:

- everything before the first `:` becomes a heading,
- the rest is split at each `,` into list items,
- and the heading gets a count.

A public `APIError` thrown from a hook as

`Refused: this title, as written, is reserved. Choose another.`

is shown as:

```text
Refused (3):
  • this title
  • as written
  • is reserved. Choose another.
```

Payload's own validation errors already carry their field paths in `data.errors`, so the text parsing could be limited to those.

We've worked around this by writing error messages without a colon followed by commas.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/toast-splits-message

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro adds a `posts` collection whose `beforeChange` hook throws `new APIError('Refused: this title, as written, is reserved. Choose another.', 400, undefined, true)`.

A Next 16.4 production build shows "An unknown error occurred." instead (#18774, fixed, not yet released), so reproduce in `next dev`, or on Next 16.3.x in production.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Posts > Create New, enter a title, then Save.

**Expected:** the toast shows the message as written.

**Actual:** the toast shows "Refused (3):" and the three-item list above.

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
