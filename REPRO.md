# Admin password inputs ignore the `password` field's validation

Payload 3.90.2, Next 16.4.0, Postgres.

## Setup

`src/collections/Users.ts` sets an 8-character minimum the documented way: by overriding the
auth `password` field with a field of the same name
([Authentication overview](https://payloadcms.com/docs/authentication/overview)).

```ts
fields: [{ name: 'password', type: 'text', hidden: true, minLength: 8 }]
```

The server applies it: `POST /api/users` with `abcd` is refused with "minimum length of 8
characters".

## Steps

1. `pnpm dev`, and create the first user with an 8+ character password.
2. Users > Create New, with any email and password `ab`, then Save.
3. Change the password to `abc` and Save again.
4. Sign out, open `/admin/reset/anything`, enter `ab` in both fields and submit. No real token
   is needed: this check runs first.

## Expected

The admin checks against the field's minimum of 8 every time.

## Actual

| Step | Password | Who refuses it | Message |
|---|---|---|---|
| 2 | `ab` | Admin, before sending | "minimum length of **3** characters" |
| 3 | `abc` | Server (`POST /api/users`) | "minimum length of **8** characters" |
| 4 | `ab` | Admin reset screen | "minimum length of **3** characters" |

So the user is told the minimum is 3, then 8.

Both screens render the password input inline with a fixed field,
`PasswordField field={{ name: 'password', label, required: true }}`, and never read the
collection's `password` field for validation:

- `@payloadcms/ui` `dist/views/Edit/Auth/index.js`, the Create New / change password input.
  It checks the override only for its access permissions (`hasPasswordFieldOverride`).
- `@payloadcms/next` `dist/views/ResetPassword/ResetPasswordForm/index.js`, the reset form.

The server's reset endpoint is a separate bug: it skips the field's validation entirely
(`repro/reset-password-skips-validation`).

## Prior art

#11982, closed and locked in April 2025. A comment there reports the same "minimum 3" for a
2-character password while 8 is enforced.
