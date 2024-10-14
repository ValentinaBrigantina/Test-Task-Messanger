import { relations } from 'drizzle-orm'
import { pgTable, serial } from 'drizzle-orm/pg-core'
import { messages } from './messages'

export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
})

export const channelsRelations = relations(channels, ({ many }) => ({
    channel: many(messages),
  }))