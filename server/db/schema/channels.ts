import { relations } from 'drizzle-orm'
import { boolean, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { messages } from './messages'
import { usersToChannels } from './usersToChannels'

export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  isGroup: boolean('isGroup').notNull().default(false),
})

export const channelsRelations = relations(channels, ({ many }) => ({
  messages: many(messages),
  usersToChannels: many(usersToChannels),
}))

export const insertChannelSchema = createInsertSchema(channels)
export const selectChannelSchema = createSelectSchema(channels)
