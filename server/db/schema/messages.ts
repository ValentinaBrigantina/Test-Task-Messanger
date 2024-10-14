import { text, pgTable, serial, date, integer } from 'drizzle-orm/pg-core'
import { users } from './users'
import { channels } from './channels'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const messages = pgTable(
  'messages',
  {
    id: serial('id').primaryKey(),
    text: text('text').notNull(),
    createdAt: date('created_at', { mode: 'date' }).notNull(),
    authorID: integer('author_id').references(() => users.id).notNull(),
    target: integer('target').references(() => users.id),
    channelID: integer('channel_id').references(() => channels.id),
  },
)

export const postsRelations = relations(messages, ({ one }) => ({
  author: one(users, {
    fields: [messages.authorID],
    references: [users.id],
    relationName: 'author',
  }),
  target: one(users, {
    fields: [messages.target],
    references: [users.id],
    relationName: 'target',
  }),
  channel: one(channels, {
    fields: [messages.channelID],
    references: [channels.id],
  })
}))

export const insertMessageSchema = createInsertSchema(messages)
export const selectMessageSchema = createSelectSchema(messages)
