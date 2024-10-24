import {
  text,
  pgTable,
  serial,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'

import { users } from './users'
import { channels } from './channels'
import { MessageType } from '../../helpers/constants'

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  type: integer('type').notNull().default(MessageType.Text),
  text: text('text'),
  src: text('src'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  authorID: integer('author_id')
    .references(() => users.id)
    .notNull(),
  targetID: integer('target').references(() => users.id),
  channelID: integer('channel_id').references(() => channels.id),
  isChat: boolean('isChat').notNull().default(false),
})

export const postsRelations = relations(messages, ({ one }) => ({
  author: one(users, {
    fields: [messages.authorID],
    references: [users.id],
    relationName: 'author',
  }),
  target: one(users, {
    fields: [messages.targetID],
    references: [users.id],
    relationName: 'target',
  }),
  channel: one(channels, {
    fields: [messages.channelID],
    references: [channels.id],
  }),
}))

export const insertMessageSchema = createInsertSchema(messages)
export const selectMessageSchema = createSelectSchema(messages)
export type MessageSchemaInsert = z.infer<typeof insertMessageSchema>
export type MessageSchemaSelect = z.infer<typeof selectMessageSchema>
