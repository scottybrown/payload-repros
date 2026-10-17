# Reset password ignores the password field's validation

Payload 3.90.2, Next 16.4.0, Postgres.

## Setup

`src/collections/Users.ts` sets an 8-character minimum the documented way: by overriding the
auth `password` field with a field of the same name
([Authentication overview](https://payloadcms.com/docs/authentication/overview)).

```ts
fields: [{ name: 'password', type: 'text', hidden: true, minLength: 8 }]
```

Everywhere else applies it. REST create and first-register refuse `abcd`, and the admin's
Users > Create New reports "minimum length of 8 characters".

## Steps

```bash
pnpm dev

# 1. First user, valid password
curl -X POST localhost:3000/api/users/first-register -H 'Content-Type: application/json' \
  -d '{"email":"dev@example.com","password":"longenough1"}'

# 2. Ask for a reset, and read the token (no email adapter is configured)
curl -X POST localhost:3000/api/users/forgot-password -H 'Content-Type: application/json' \
  -d '{"email":"dev@example.com"}'
psql "$DATABASE_URL" -c 'select reset_password_token from users where id = 1'

# 3a. In the admin: open /admin/reset/<token>, enter "ab" in both fields, submit
# 3b. Over REST: reset to "abc"
curl -X POST localhost:3000/api/users/reset-password -H 'Content-Type: application/json' \
  -d '{"token":"<token>","password":"abc"}'
```

Step 3a needs no real token. `/admin/reset/anything` renders the form, and the browser
check runs before the token is checked.

## Expected

Both are refused with "minimum length of 8 characters".

## Actual

- **3a, admin:** the reset screen's browser check reports "minimum length of **3**
  characters". It ignores the field's `minLength`.
- **3b, server:** returns 200 "Password reset successfully.", and `abc` logs in.

So the reset path applies neither the field's validation nor its configured minimum, in
the browser or on the server. A `beforeValidate` hook doesn't help either. On reset it
runs after the password has been hashed: `data` holds `salt` and `hash`, but no `password`.

## Prior art

#7582 "Reset Password form is not running beforeValidate hook", closed as fixed in
v3.0.0-beta.114. The hook now runs, but without the password, and that issue didn't cover
the field's own validation.
