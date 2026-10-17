# Reset password ignores the `password` field's validation

## Describe the Bug

A password minimum set with the documented `password` field override (`{ name: 'password', type: 'text', hidden: true, minLength: 8 }`) is applied on create, update and the admin's Create New screen, but not on reset password:

- The admin's reset screen checks against the default minimum of 3 ("minimum length of 3 characters").
- `POST /api/users/reset-password` accepts `abc`, and the user can then log in with it.

A `beforeValidate` hook can't enforce it either: on reset, `data` holds the new `salt` and `hash` but no `password`.

**Workaround:** patch the `password` validator's default `minLength` in `payload/dist/fields/validations.js` (we use `pnpm patch`), which the reset path falls back to.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/reset-password-skips-validation

## Reproduction Steps

1. `pnpm dev`, and create the first user with an 8+ character password.
2. Users > Create New with password `abcd`: refused, "minimum length of 8 characters" (expected).
3. Sign out and open `/admin/reset/anything`. Enter `ab` in both fields and submit: "minimum length of **3** characters". The check runs before the token, so any token works.
4. `POST /api/users/forgot-password` for the user, read `reset_password_token` from the `users` table, then:
   ```bash
   curl -X POST localhost:3000/api/users/reset-password -H 'Content-Type: application/json' \
     -d '{"token":"<token>","password":"abc"}'
   ```
   Returns 200 "Password reset successfully."

Expected: steps 3 and 4 are refused with the field's minimum of 8.

Related: #7582 (closed). It fixed the hook running at all, but not this.

## Which area(s) are affected?

area: core, area: ui

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
