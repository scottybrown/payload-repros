import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // The documented override of an auth field: a field with the same name. hidden avoids a duplicate input.
    { name: 'password', type: 'text', hidden: true, minLength: 8 },
  ],
}
