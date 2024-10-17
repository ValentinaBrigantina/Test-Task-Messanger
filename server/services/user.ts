import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users as usersTable, type UserSchemaSelect } from '../db/schema/users'

export const getUserByName = async (
  name: string
): Promise<UserSchemaSelect> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.name, name))
  return user
}

export const getUserByID = async (id: number): Promise<UserSchemaSelect> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id))
  return user
}
