# Field error tooltip truncates its message, cutting off the part the user needs

## Describe the Bug

A field error tooltip is a single line clipped with an ellipsis at the field's width, and it doesn't wrap. On the reset password screen the password error reads "This value must be longer than the minimum length of ...", so the number the user needs is the part cut off. Any field error longer than its field is cut the same way, custom validation messages included.

We've worked around this by shortening the message through an i18n override of the validation translation.

Related: #16774 is about descenders being clipped vertically. That's the same tooltip, but a different problem.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/password-error-truncated

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro is the untouched blank template.

1. `pnpm dev` and open `/admin/reset/anything`. No real token is needed.
2. Enter `ab` in both password fields and press Reset Password.

**Expected:** the whole message is readable.

**Actual:** the tooltip reads "This value must be longer than the minimum length of ...". The create-first-user screen truncates the same message. A screenshot is in the branch's `REPRO.md` (Chrome at 1440x900).

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
