# A field condition makes its database column nullable

Payload 3.90.2, Postgres. **Verdict: by design, not a bug.** Kept to show the mechanism.

## Setup

`src/collections/Posts.ts` has two required text fields. They differ only in that
`subtitle` has `admin: { condition: () => true }`.

## Steps

```bash
pnpm payload migrate:create posts
```

## Result

`src/migrations/20261017_014912_posts.ts`:

```sql
"title" varchar NOT NULL,
"subtitle" varchar,
```

## Why

- The schema builder sets NOT NULL only when `field.required && !field.admin?.condition`
  (`@payloadcms/drizzle` `dist/schema/traverseFields.js`).
- Server-side validation skips any field whose condition is false
  (`payload` `dist/fields/hooks/beforeChange/promise.js`:
  `skipValidationFromHere = ... || !passesCondition`). So a required field
  hidden by its condition can legitimately be saved empty, and the column has to
  allow NULL.
- Payload can't tell that a condition is always true, so any condition at all
  loosens the column.

Our earlier observation that "every later `migrate:create` emits the same statements
again" came from hand-editing the generated migration to keep NOT NULL in the snapshot
while the config still said nullable. The generator was right to emit the
statements again.
