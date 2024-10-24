import { relations } from 'drizzle-orm'
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { messages } from './messages'
import { usersToChannels } from './usersToChannels'

export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
})

export const channelsRelations = relations(channels, ({ many }) => ({
  messages: many(messages),
  usersToChannels: many(usersToChannels),
}))
