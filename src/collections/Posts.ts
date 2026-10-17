import { APIError, type CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  hooks: {
    beforeChange: [
      () => {
        throw new APIError('Refused: this title, as written, is reserved. Choose another.', 400, undefined, true)
      },
    ],
  },
  fields: [{ name: 'title', type: 'text' }],
}
