import { createMiddleware } from 'hono/factory'
import { getDataFromToken } from '../services/auth'
import type { UserSchemaSelect } from '../db/schema/users'
import { getUserByID } from '../services/user'

export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
}

export type Env = {
  Variables: {
    user: UserSchemaSelect
  }
}

export const getUser = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = token ? getDataFromToken(token) : null
    if (!payload) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const { id } = payload
    const user: UserSchemaSelect = await getUserByID(id as number)
    c.set('user', user)
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  await next()
})
