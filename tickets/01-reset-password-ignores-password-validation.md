# `reset-password` skips the `password` field's validation

## Describe the Bug

A password minimum set with the documented `password` field override (`{ name: 'password', type: 'text', hidden: true, minLength: 8 }`) is enforced by create and update, but not by `POST /api/users/reset-password`, which accepts `abc`. The user can then log in with it.

`resetPassword` (`payload/dist/auth/operations/resetPassword.js`) hashes the new password with `generatePasswordSaltHash`. That runs the `password` validator against a hardcoded field with no `minLength`, so the default of 3 applies. It then writes with `payload.db.updateOne`, so the collection's field validation never runs. A `beforeValidate` hook doesn't help either: it runs after hashing, and `data` holds `salt` and `hash` but no `password`.

The admin's reset screen has a related but separate problem: its browser-side check ignores the override too. That's covered in a separate issue.

**Workaround:** patch the `password` validator's default `minLength` in `payload/dist/fields/validations.js` (we use `pnpm patch`), since the reset path falls back to it.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/reset-password-skips-validation

## Reproduction Steps

1. `pnpm dev`, and create the first user with an 8+ character password.
2. `POST /api/users` with password `abcd`: refused, "minimum length of 8 characters" (expected).
3. `POST /api/users/forgot-password` for the first user, then read `reset_password_token` from the `users` table (no email adapter is configured).
4. Reset to `abc`:
   ```bash
   curl -X POST localhost:3000/api/users/reset-password -H 'Content-Type: application/json' \
     -d '{"token":"<token>","password":"abc"}'
   ```
   Returns 200 "Password reset successfully.", and `abc` logs in.

Expected: step 4 is refused with the field's minimum of 8, as step 2 is.

Related: #7582 (closed). It fixed the hook running at all, but not this.

## Which area(s) are affected?

area: core

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
