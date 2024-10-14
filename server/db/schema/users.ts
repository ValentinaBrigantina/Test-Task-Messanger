import { text, pgTable, serial } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { Role } from '../../helpers/getUser'
import { relations } from 'drizzle-orm'
import { messages } from './messages'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  role: text('role').notNull().default(Role.User),
})

export const usersRelations = relations(users, ({ many }) => ({
  author: many(messages, { relationName: 'author' }),
  target: many(messages, { relationName: 'target' }),
}))

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export type UserSchema = z.infer<typeof selectUserSchema>
