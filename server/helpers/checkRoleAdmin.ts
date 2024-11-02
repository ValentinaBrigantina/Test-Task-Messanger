import type { MiddlewareHandler } from 'hono/types'
import { Role } from './getUser'

export const checkRoleAdmin: MiddlewareHandler = async (c, next) => {
  const user = c.var.user
  if (!user || user.role !== Role.Admin) {
    return c.json({ error: 'Forbidden: Admin only' }, 403)
  }
  await next()
}