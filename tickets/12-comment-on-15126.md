# Comment for #15126 (Autosave combined with `unique: true` crashes "Create New")

Still happening on Payload 3.91.0 / Next 16.4.0 / Postgres, with two additions.

**It blanks on the first Create New, not only the second.** With `versions: { drafts: { autosave: true } }` and a text field with `unique: true, defaultValue: ''`, the first visit to Create New logs a 307 (the autosaved draft being created), then the create screen collides with that draft's empty value and renders blank:

```text
GET /admin/collections/posts/create 307
key not found: error:valueMustBeUnique
key not found: error:followingFieldsInvalid
INFO: error:followingFieldsInvalid title
```

**Where the "key not found" comes from:** the Postgres adapter builds its duplicate-value error with `req.t('error:valueMustBeUnique')` (`@payloadcms/drizzle` `handleUpsertError.js`), but admin requests set up in `@payloadcms/next` `initReq.js` use the client-side translations, which don't include those two `error:*` keys. So the error's message is the raw key. A plain Save of a duplicate without autosave shows "Value must be unique" correctly.

**Workaround for the raw keys:** supply `error:valueMustBeUnique` and `error:followingFieldsInvalid` through the `i18n.translations` config. The blank screen remains.

Reproduction: https://github.com/scottybrown/payload-repros/tree/repro/unique-error-raw-key
