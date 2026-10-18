# Reset password ignores the `password` field's validation

## Describe the Bug

A password minimum set with the documented `password` field override (`{ name: 'password', type: 'text', hidden: true, minLength: 8 }`) is enforced when creating or updating a user, but not on reset password. Through Forgot password, a user can set their password to `abc` and log in with it.

`resetPassword` (`payload/dist/auth/operations/resetPassword.js`) hashes the new password with `generatePasswordSaltHash`. That runs the `password` validator against a hardcoded field with no `minLength`, so the default of 3 applies. It then writes with `payload.db.updateOne`, so the collection's field validation never runs. A `beforeValidate` hook doesn't help either: it runs after hashing, and `data` holds `salt` and `hash` but no `password`.

The admin's reset screen has a related but separate problem: its browser-side check ignores the override too. That's covered in a separate issue.

**Workaround:** patch the `password` validator's default `minLength` in `payload/dist/fields/validations.js` (we use `pnpm patch`), since the reset path falls back to it.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/reset-password-skips-validation

## Reproduction Steps

All in the admin. The repro's config includes a minimal email adapter that writes each email to the server log, so the reset link can be followed.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Users > Create New, with any email and password `abc`, then Save. It's refused with "minimum length of 8 characters", as expected.
3. Log out, choose "Forgot password?", enter the first user's email and submit.
4. Open the reset link from the email in the server log, on `http://localhost:3000`. The link is relative because no `serverURL` is set.
5. Enter `abc` as the new password, confirm it, and press Reset Password.

Expected: step 5 is refused with "minimum length of 8 characters", as step 2 is.

Actual: "Password reset successfully." The user is signed in, and can log in again with `abc`.

Related: #7582 (closed). It fixed the hook running at all, but not this.

## Which area(s) are affected?

area: core

## Environment Info

```text
Binaries:
  Node: 22.18.0
  pnpm: 10.14.0
Relevant Packages:
  payload: 3.91.0
  next: 16.4.0
  @payloadcms/db-postgres: 3.91.0
  @payloadcms/ui/shared: 3.91.0
  react: 19.2.6
Operating System:
  Platform: darwin
  Arch: arm64
```
