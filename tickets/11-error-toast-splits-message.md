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

**Workaround:** write error messages without a colon followed by commas.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/toast-splits-message

## Reproduction Steps

1. A `posts` collection whose `beforeChange` hook throws `new APIError('Refused: this title, as written, is reserved. Choose another.', 400, undefined, true)`.
2. `pnpm dev`, sign in, create a post, Save.
3. The toast shows "Refused (3):" and the three-item list above.

Expected: the message as written.

Note: a Next 16.4 production build shows "An unknown error occurred." instead (#18774, fixed, not yet released), so reproduce in `next dev`, or on Next 16.3.x in production.

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
