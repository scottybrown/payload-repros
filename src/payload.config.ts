import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { APIError, buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import {
  BulkEditPosts,
  REFUSED_SCHEDULE_SLUG,
  RefusedSchedulePosts,
  ScheduledPosts,
  ToastPosts,
  UniqueAutosavePosts,
} from './collections/repros'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    ScheduledPosts,
    RefusedSchedulePosts,
    BulkEditPosts,
    ToastPosts,
    UniqueAutosavePosts,
  ],
  editor: lexicalEditor(),
  jobs: {
    // Repro 7. Without runHooks, jobs.queue writes to the database directly and skips collection hooks.
    runHooks: true,
    jobsCollectionOverrides: ({ defaultJobsCollection }) => ({
      ...defaultJobsCollection,
      hooks: {
        ...defaultJobsCollection.hooks,
        beforeChange: [
          ({ data, operation }) => {
            if (operation === 'create' && data?.input?.doc?.relationTo === REFUSED_SCHEDULE_SLUG) {
              throw new APIError('Scheduling is refused.', 403, undefined, true)
            }
            return data
          },
        ],
      },
    }),
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
