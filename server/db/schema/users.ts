import { text, pgTable, serial } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { Role } from '../../helpers/getUser'
import { messages } from './messages'
import { usersToChannels } from './usersToChannels'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  role: text('role').notNull().default(Role.User),
})

export const usersRelations = relations(users, ({ many }) => ({
  authoredMessages: many(messages, { relationName: 'author' }),
  targetedMessages: many(messages, { relationName: 'target' }),
  usersToChannels: many(usersToChannels)
}))

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export type UserSchemaSelect = z.infer<typeof selectUserSchema>
