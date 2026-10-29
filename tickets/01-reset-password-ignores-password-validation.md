# `reset-password` skips the `password` field's validation

Filed as https://github.com/payloadcms/payload/issues/18823. Fixed in 3.92.1.

## Describe the Bug

A password minimum set with the documented `password` field override (`{ name: 'password', type: 'text', hidden: true, minLength: 8 }`) is enforced when creating or updating a user, but **not** on reset password: through Forgot password, a user can set their password to `abc` and log in with it.

`resetPassword` (`payload/dist/auth/operations/resetPassword.js`) hashes the new password with `generatePasswordSaltHash`. That runs the `password` validator against a hardcoded field with no `minLength`, so the default of 3 applies. It then writes with `payload.db.updateOne`, so the collection's field validation never runs. The `beforeValidate` hook approach suggested in #11982 doesn't help either: on reset it runs after hashing, and `data` holds `salt` and `hash` but no `password`.

We've worked around this by patching the `password` validator's default `minLength` in `payload/dist/fields/validations.js`, since the reset path falls back to it.

Related: #7582 (closed). It fixed the hook running at all, but not this.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/reset-password-skips-validation

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

The repro's config includes a minimal email adapter that writes each email to the server log, so the reset link can be followed.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Users > Create New, with any email and password `abc`, then Save. It's refused with "minimum length of 8 characters", as expected ✅
3. Log out, choose "Forgot password?", enter the first user's email and submit.
4. Open the reset link from the email in the server log, on `http://localhost:3000`. The link is relative because no `serverURL` is set.
5. Enter `abc` as the new password, confirm it, and press Reset Password.

**Expected:** step 5 is refused with "minimum length of 8 characters", as step 2 is.

**Actual:** "Password reset successfully." The user is signed in, and can log in again with `abc`.

## Which area(s) are affected?

area: core

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
