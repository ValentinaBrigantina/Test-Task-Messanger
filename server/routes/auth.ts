import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { type JwtVariables } from 'hono/jwt'
import { login, registration } from '../services/auth'
import { authMiddleware } from '../helpers/bearerAuth'
import { getUser } from '../helpers/getUser'
import { authUserData, type JwtToken, type UserProfile } from '../sharedTypes'
import type { UserSchema } from '../db/schema/users'

type Variables = JwtVariables

export const authRoute = new Hono<{ Variables: Variables }>()

  .post('/login', zValidator('json', authUserData), async (c) => {
    const authData = c.req.valid('json')
    const token: JwtToken = await login(authData)
    return c.json(token)
  })

  .post('/register', zValidator('json', authUserData), async (c) => {
    const authData = c.req.valid('json')
    const user: UserProfile = await registration(authData)
    c.status(201)
    return c.json(user)
  })

  .get('/me',authMiddleware, getUser, async (c) => {
    const { password, ...user }: UserSchema = c.var.user
    return c.json({ user })
  })

