# Admin password inputs ignore the `password` field's validation, so the admin and server report different minimums

## Describe the Bug

With the documented `password` field override (`{ name: 'password', type: 'text', hidden: true, minLength: 8 }`), the server enforces 8 characters, but the admin's own password inputs still check against the built-in default of 3. In Users > Create New:

- `ab`: the admin refuses it with "minimum length of **3** characters", without sending it to the server.
- `abc`: the admin accepts it and sends it, and the server refuses it with "minimum length of **8** characters".

So the user is told 3, then 8. The reset password screen has the same browser-side check, and also says 3.

Both screens render the password input inline with a fixed field, `PasswordField field={{ name: 'password', label, required: true }}`:

- the edit view in `@payloadcms/ui` `dist/views/Edit/Auth/index.js`;
- the reset form in `@payloadcms/next` `dist/views/ResetPassword/ResetPasswordForm/index.js`.

Neither reads the collection's `password` field for validation. The edit view checks the override only for its access permissions.

**Workaround:** patch the `password` validator's default `minLength` in `payload/dist/fields/validations.js` (we use `pnpm patch`), which both inputs fall back to.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/password-minimum-not-configurable

## Reproduction Steps

1. `pnpm dev`, and create the first user with an 8+ character password.
2. Users > Create New, with any email and password `ab`, then Save: "minimum length of 3 characters". No request goes to `/api/users`.
3. Change the password to `abc` and Save: the request goes to `/api/users`, and the server refuses it with "minimum length of 8 characters".
4. Sign out and open `/admin/reset/anything`. Enter `ab` and submit: "minimum length of 3 characters". Any token works, because this check runs first.

Expected: the admin checks against the field's minimum of 8 in steps 2 and 4.

Related: #11982 (closed and locked, April 2025). A comment there reports the same "minimum 3" for a 2-character password while 8 is enforced.

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
