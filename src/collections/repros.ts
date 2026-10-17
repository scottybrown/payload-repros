import { APIError, type CollectionConfig } from 'payload'

export const REFUSED_SCHEDULE_SLUG = 'refused-schedule-posts'

// Repros 6 and 8: scheduling, with no job runner, so a schedule stays queued.
export const ScheduledPosts: CollectionConfig = {
  slug: 'scheduled-posts',
  admin: { useAsTitle: 'title' },
  versions: { drafts: { schedulePublish: true } },
  fields: [{ name: 'title', type: 'text' }],
}

// Repro 7: the jobs collection refuses schedules for this collection only (see payload.config.ts).
export const RefusedSchedulePosts: CollectionConfig = {
  slug: REFUSED_SCHEDULE_SLUG,
  admin: { useAsTitle: 'title' },
  versions: { drafts: { schedulePublish: true } },
  fields: [{ name: 'title', type: 'text' }],
}

// Repro 9: a field hidden from the admin, still offered by bulk edit.
export const BulkEditPosts: CollectionConfig = {
  slug: 'bulk-edit-posts',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'lastSavedBy', type: 'text', label: 'Last saved by', admin: { hidden: true } },
  ],
}

// Repro 11: every save is refused with a message containing a colon and commas.
export const ToastPosts: CollectionConfig = {
  slug: 'toast-posts',
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

// Repro 12: autosave with a unique field defaulting to ''. Create New collides with its own draft.
export const UniqueAutosavePosts: CollectionConfig = {
  slug: 'unique-autosave-posts',
  admin: { useAsTitle: 'title' },
  versions: { drafts: { autosave: true } },
  fields: [{ name: 'title', type: 'text', unique: true, defaultValue: '' }],
}
