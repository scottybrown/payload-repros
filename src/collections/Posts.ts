import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  versions: { drafts: { autosave: true } },
  fields: [{ name: 'title', type: 'text', unique: true, defaultValue: '' }],
}
