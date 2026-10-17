# The password minimum length is fixed at 3 and can't be configured

Payload 3.90.2, Next 16.4.0, Postgres. The untouched blank template; no code change.

## Steps

1. `pnpm dev`, open `/admin/create-first-user`.
2. Enter `ab` as the password and submit. The field reports "This value must be
   longer than the minimum length of 3 characters."
3. Enter `abc`. The user is created and signed in.

## Expected

A way to set the minimum, for example on `auth` in the collection config, which the
server and the admin's own browser-side check both apply.

## Actual

There's no option for it:

- `IncomingAuthType` (`payload/dist/auth/types.d.ts`) has no minimum-length or
  password-policy setting.
- The `password` validator in `payload/dist/fields/validations.js` defaults
  `minLength = 3`. Nothing passes it a different value: the admin builds its password
  input inline (`@payloadcms/ui` `Edit/Auth`) and never reads a field from the collection.
- A `beforeValidate` hook can refuse short passwords on the server, but the admin's
  browser check still says "minimum length of 3", so the hook and the admin disagree.
  The hook also doesn't apply on reset password (a separate issue).

The only way we found to raise the floor is patching the validator's default.

## Prior art

#11982 "I'm unable to change the validation rules for the password field in the users
collection", closed and locked in April 2025 without a fix.
