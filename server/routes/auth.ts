import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { type JwtVariables } from 'hono/jwt'
import { login, registration } from '../services/auth'
import { authMiddleware } from '../helpers/bearerAuth'
import { getUser } from '../helpers/getUser'
import { authUserData, type JwtToken, type UserProfile } from '../sharedTypes'
import type { UserSchemaSelect } from '../db/schema/users'
import { server } from '../index'
import { WsActions } from '../helpers/constants'

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
    server.publish(WsActions.UpdateContacts, JSON.stringify({ eventType: WsActions.UpdateContacts, contact: user }))
    c.status(201)
    return c.json(user)
  })

  .get('/me',authMiddleware, getUser, async (c) => {
    const { password, ...user }: UserSchemaSelect = c.var.user
    return c.json({ user })
  })

