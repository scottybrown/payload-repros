# Reset password ignores the password field's validation

Payload 3.90.2, Next 16.4.0, Postgres.

## Setup

- `src/collections/Users.ts` sets an 8-character minimum the documented way: by overriding the
  auth `password` field with a field of the same name
  ([Authentication overview](https://payloadcms.com/docs/authentication/overview)).

  ```ts
  fields: [{ name: 'password', type: 'text', hidden: true, minLength: 8 }]
  ```

- `src/payload.config.ts` has a minimal email adapter that writes each email to the server
  log, so the reset link can be followed. No `serverURL` is set, so the link in the email is
  relative. Open it on `http://localhost:3000`.

## Steps

All in the admin.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Users > Create New, with any email and password `abc`, then Save. It's refused:
   "minimum length of 8 characters". This is the expected behaviour.
3. Log out. On the login screen, choose "Forgot password?", enter the first user's email and submit.
4. Open the reset link from the email in the server log (`EMAIL to …`).
5. Enter `abc` as the new password, confirm it, and press Reset Password.

## Expected

Step 5 is refused with "minimum length of 8 characters", as step 2 is.

## Actual

"Password reset successfully." The user is signed in, and can log in again with `abc`.

`resetPassword` (`payload/dist/auth/operations/resetPassword.js`) hashes the new password with
`generatePasswordSaltHash`. That checks it with the `password` validator against a hardcoded
field with no `minLength`, so the default of 3 applies. It then writes with
`payload.db.updateOne`, so the collection's field validation never runs.

The reset screen's own browser check also uses 3 instead of the field's 8. That's a separate
issue, on `repro/password-minimum-not-configurable`.

## Prior art

#7582 "Reset Password form is not running beforeValidate hook", closed as fixed in
v3.0.0-beta.114. The hook now runs, but after hashing: `data` holds `salt` and `hash`, not
`password`.
