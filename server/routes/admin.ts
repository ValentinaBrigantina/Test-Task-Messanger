import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { authUserData, type UserProfile } from '../sharedTypes'
import { registration } from '../services/auth'
import { getUser, Role } from '../helpers/getUser'
import { getAdmin, getUsers } from '../services/user'
import { checkRoleAdmin } from '../helpers/checkRoleAdmin'
import { authMiddleware } from '../helpers/bearerAuth'

export const adminRoute = new Hono()

  .get('/', authMiddleware, getUser, checkRoleAdmin, async (c) => {
    const dataUsers = await getUsers()
    const dataWithoutPassword = dataUsers.map((user) => {
      const { password, ...data } = user
      return data
    })
    return c.json(dataWithoutPassword)
  })

  .post('/create', zValidator('json', authUserData), async (c) => {
    const authData = c.req.valid('json')
    const existingAdmin = await getAdmin()
    if (existingAdmin) {
      throw new HTTPException(409, { message: 'Admin already exist' })
    }
    const admin: UserProfile = await registration({
      ...authData,
      role: Role.Admin,
    })
    c.status(201)
    return c.json(admin)
  })
