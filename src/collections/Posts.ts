import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text' },
    // Set by a hook in a real app; never shown in the admin.
    { name: 'lastSavedBy', type: 'text', label: 'Last saved by', admin: { hidden: true } },
  ],
}
