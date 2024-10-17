import { createMiddleware } from 'hono/factory'
import { getDataFromToken } from '../services/auth'
import type { UserSchemaSelect } from '../db/schema/users'
import { getUserByName } from '../services/user'

export enum Role {
  User = 'user',
  Admin = 'admin',
}

type Env = {
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
    const payload = token ? await getDataFromToken(token) : null
    if (!payload) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const { name } = payload
    const userData: UserSchemaSelect = await getUserByName(name as string)
    c.set('user', userData)
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  await next()
})
