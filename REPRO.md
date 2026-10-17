# Not a bug: the password minimum length is configurable

Payload 3.90.2, Next 16.4.0, Postgres. **Don't file.** Kept as a record of the check.

The default minimum is 3. The documented way to change it is to override the auth
field with a field of the same name
([Authentication overview](https://payloadcms.com/docs/authentication/overview),
"can be overridden by defining a custom field with the same name"):

```ts
fields: [{ name: 'password', type: 'text', hidden: true, minLength: 8 }]
```

Tested on this template:

| Where | Result |
|---|---|
| REST `first-register` and `POST /api/users` with `abcd` | Refused: "minimum length of 8 characters" |
| Admin, Users > Create New with `abcd` | Browser check: "minimum length of 8 characters" |

The one place it isn't applied is reset password. That's the bug, and it's on
`repro/reset-password-skips-validation`.
