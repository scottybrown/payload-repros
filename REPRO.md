# Admin password inputs ignore the `password` field's validation

Payload 3.91.0, Next 16.4.0, Postgres.

## Setup

`src/collections/Users.ts` sets an 8-character minimum the documented way: by overriding the
auth `password` field with a field of the same name
([Authentication overview](https://payloadcms.com/docs/authentication/overview)).

```ts
fields: [{ name: 'password', type: 'text', hidden: true, minLength: 8 }]
```

Copy `.env.example` to `.env` and point `DATABASE_URL` at an empty Postgres database.

## Steps

All in the admin.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Users > Create New, with any email and password `ab`, then Save.
3. Change the password to `abc` and Save again.

## Expected

Both are refused with "minimum length of 8 characters".

## Actual

| Step | Password | Message |
|---|---|---|
| 2 | `ab` | "minimum length of **3** characters" |
| 3 | `abc` | "minimum length of **8** characters" |

So the user is told the minimum is 3, then 8. Step 2 is the admin panel's in-browser check,
which runs before anything is sent. Step 3 passes that check, and it's the server that refuses it.

Create New renders the password input inline with a fixed field,
`PasswordField field={{ name: 'password', label, required: true }}`
(`@payloadcms/ui` `dist/views/Edit/Auth/index.js`), and never reads the collection's `password`
field for validation. It checks the override only for its access permissions
(`hasPasswordFieldOverride`).

## Prior art

#11982, closed and locked in April 2025. [A comment there](https://github.com/payloadcms/payload/issues/11982#issuecomment-2789466003)
reports the same "minimum 3" for a 2-character password while 8 is enforced.
