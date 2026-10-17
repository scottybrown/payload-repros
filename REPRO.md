# Reset password skips the collection's password validation

Payload 3.90.2, Next 16.4.0, Postgres.

## Setup

`src/collections/Users.ts` adds one `beforeValidate` hook: a password shorter than
8 characters is refused. The hook logs the keys of `data` it receives.

## Steps

```bash
pnpm dev

# 1. First user, valid password
curl -X POST localhost:3000/api/users/first-register -H 'Content-Type: application/json' \
  -d '{"email":"dev@example.com","password":"longenough1"}'

# 2. Changing it to "abc" through update is refused, as expected (400)
curl -X PATCH localhost:3000/api/users/1 -H 'Content-Type: application/json' \
  -H 'Authorization: JWT <token from step 1>' -d '{"password":"abc"}'

# 3. Ask for a reset, and read the token (no email adapter is configured)
curl -X POST localhost:3000/api/users/forgot-password -H 'Content-Type: application/json' \
  -d '{"email":"dev@example.com"}'
psql "$DATABASE_URL" -c 'select reset_password_token from users where id = 1'

# 4. Reset to "abc"
curl -X POST localhost:3000/api/users/reset-password -H 'Content-Type: application/json' \
  -d '{"token":"<token>","password":"abc"}'
```

## Expected

Step 4 is refused with the same validation error as step 2.

## Actual

Step 4 returns 200 "Password reset successfully." and `abc` logs in.

The hook runs, but the reset operation has already hashed the password: `data`
holds `salt` and `hash`, and no `password` key, so no hook or validator can check
the new password's length.

```text
create (step 1):  email, password, ..., salt, hash, ...
update (step 2):  password, ..., salt, hash, ...      -> refused
reset  (step 4):  id, ..., salt, hash, ...            -> no password key, accepted
```

## Prior art

#7582 "Reset Password form is not running beforeValidate hook", closed as fixed in
v3.0.0-beta.114. The hook now runs, but without the password.
