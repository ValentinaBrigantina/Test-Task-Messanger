import { text, pgTable, serial } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { Role } from '../../helpers/getUser'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  role: text('role').notNull(),
})

export const insertUserSchema = createInsertSchema(users, {
  id: z.number().int().positive().min(1),
  name: z.string().min(2).max(20),
  password: z.string().min(2).max(20),
  avatar: z.string().url(),
  role: z.nativeEnum(Role),
})

export const selectUserSchema = createSelectSchema(users)
export type UserSchema = z.infer<typeof selectUserSchema>
