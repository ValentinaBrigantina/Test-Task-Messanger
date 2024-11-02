import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users, type UserSchemaSelect } from '../db/schema/users'
import { Role } from '../helpers/getUser'

export const getUserByName = async (
  name: string
): Promise<UserSchemaSelect> => {
  const [user] = await db.select().from(users).where(eq(users.name, name))
  return user
}

export const getUserByID = async (id: number): Promise<UserSchemaSelect> => {
  const [user] = await db.select().from(users).where(eq(users.id, id))
  return user
}

export const getAdmin = async (): Promise<UserSchemaSelect> => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.role, Role.Admin))
  return user
}

export const getUsers = (): Promise<UserSchemaSelect[]> => 
  db.select().from(users)

