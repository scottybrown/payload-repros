import { ValidationError, type CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  hooks: {
    // A password policy: at least 8 characters.
    beforeValidate: [
      ({ data, operation, req }) => {
        req.payload.logger.info({ keys: Object.keys(data ?? {}), operation }, 'beforeValidate received')
        const password = data?.password
        if (typeof password === 'string' && password.length < 8) {
          throw new ValidationError({
            collection: 'users',
            errors: [{ message: 'Password must be at least 8 characters.', path: 'password' }],
          })
        }
        return data
      },
    ],
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
