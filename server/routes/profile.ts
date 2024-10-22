import { Hono } from 'hono'
import { authMiddleware } from '../helpers/bearerAuth'
import { getUser } from '../helpers/getUser'
import { updateAvatar, updatePassword, uploadAvatar } from '../services/profile'
import { dataUpdatePassword, type UserProfile } from '../sharedTypes'
import { zValidator } from '@hono/zod-validator'
import { compareHash } from '../services/auth'
import {
  imageSchema,
  type ValidImage,
} from '../helpers/customValidation/imageSchema'

export const profileRoute = new Hono()

  .put(
    '/password',
    authMiddleware,
    getUser,
    zValidator('json', dataUpdatePassword),
    async (c) => {
      const data = c.req.valid('json')
      const user = c.var.user
      if (!(await compareHash(data.currentPassword, user.password))) {
        return c.json({ error: 'Incorrect current password' }, 400)
      }
      const res: UserProfile = await updatePassword(user.id, data.newPassword)
      return c.json(res)
    }
  )

  .put('/avatar', authMiddleware, getUser, async (c) => {
    const formData = await c.req.formData()
    const avatar = formData.get('avatar') as ValidImage | null
    if (!avatar) {
      return c.json({ error: 'No file uploaded' }, 400)
    }
    const parseResult = imageSchema.safeParse(avatar)
    if (!parseResult.success) {
      return c.json({ error: parseResult.error.errors }, 400)
    }
    const user = c.var.user
    const url = await uploadAvatar(avatar)
    const res: UserProfile = await updateAvatar(user.id, url)
    return c.json(res)
  })
