# Field error tooltip truncates its message, cutting off the part the user needs

## Describe the Bug

A field error tooltip is a single line clipped with an ellipsis at the field's width, and it doesn't wrap. On the reset password screen the password error reads "This value must be longer than the minimum length of ...", so the number the user needs is the part cut off. Any field error longer than its field is cut the same way, custom validation messages included.

**Workaround:** shorten the message through an i18n override of the validation translation.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/password-error-truncated

## Reproduction Steps

Untouched blank template.

1. `pnpm dev`, open `/admin/reset/anything` (no real token needed).
2. Enter `ab` in both password fields and press Reset Password.
3. The tooltip reads "This value must be longer than the minimum length of ..." (screenshot in the branch's `REPRO.md`, Chrome at 1440x900).

The create-first-user screen truncates the same message.

Expected: the whole message is readable.

Related: #16774 is about descenders being clipped vertically. That's the same tooltip, but a different problem.

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
