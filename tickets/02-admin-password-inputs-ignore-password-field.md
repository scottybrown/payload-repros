# Admin Create New checks passwords against a minimum of 3, ignoring the `password` field's `minLength`

## Describe the Bug

A password minimum set with the documented `password` field override (`{ name: 'password', type: 'text', hidden: true, minLength: 8 }`) is enforced by the server, but **not** by the admin panel's in-browser check on Users > Create New, which still uses the default minimum of 3. A 2-character password is refused with "minimum length of 3 characters", then a 3-character one is refused with "minimum length of 8 characters". The user is told two different minimums.

Create New renders the password input inline with a fixed field, `PasswordField field={{ name: 'password', label, required: true }}` (`@payloadcms/ui` `dist/views/Edit/Auth/index.js`), and never reads the collection's `password` field for validation. It checks the override only for its access permissions (`hasPasswordFieldOverride`).

We've worked around this by patching the `password` validator's default `minLength` in `payload/dist/fields/validations.js`, which the in-browser check falls back to.

Related: [a comment on #11982](https://github.com/payloadcms/payload/issues/11982#issuecomment-2789466003) reports the same "minimum 3" for a 2-character password while 8 is enforced. That issue was locked without a fix.

## Link to the code that reproduces this issue

https://github.com/scottybrown/payload-repros/tree/repro/admin-password-inputs-ignore-password-field

## Reproduction Steps

Copy .env.example to .env and point DATABASE_URL at an empty Postgres database.

1. `pnpm dev`, open `/admin`, and create the first user with password `longenough1`.
2. Users > Create New, with any email and password `ab`, then Save. It's refused with "minimum length of 3 characters".
3. Change the password to `abc` and Save again. It's refused with "minimum length of 8 characters" ✅

**Expected:** step 2 is refused with "minimum length of 8 characters", as step 3 is.

**Actual:** step 2 says "minimum length of 3 characters", so the user is told the minimum is 3, then 8.

## Which area(s) are affected?

area: ui

## Environment Info

```text
Binaries:
  Node: 22.18.0
  npm: 10.9.3
  Yarn: N/A
  pnpm: 10.14.0
Relevant Packages:
  payload: 3.91.0
  next: 16.4.0
  @payloadcms/db-postgres: 3.91.0
  @payloadcms/drizzle: 3.91.0
  @payloadcms/graphql: 3.91.0
  @payloadcms/next/utilities: 3.91.0
  @payloadcms/richtext-lexical: 3.91.0
  @payloadcms/translations: 3.91.0
  @payloadcms/ui/shared: 3.91.0
  react: 19.2.6
  react-dom: 19.2.6
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin Kernel Version 27.0.0: Tue Aug 11 21:06:24 PDT 2026; root:xnu-13432.1.9~1/RELEASE_ARM64_T6030
  Available memory (MB): 36864
  Available CPU cores: 11
```
