import { Hono } from 'hono'
import { authMiddleware } from '../helpers/bearerAuth'
import { getUser } from '../helpers/getUser'
import { getContacts, getMessagesForChat, uploadImage } from '../services/chat'
import {
  type MessageSchemaWithAuthorData,
  type UserProfile,
} from '../sharedTypes'
import {
  imageSchema,
  type ValidImage,
} from '../helpers/customValidation/imageSchema'

export const chatRoute = new Hono()

  .get('/contacts', authMiddleware, getUser, async (c) => {
    const { id } = c.var.user
    const contacts: UserProfile[] = await getContacts(id)
    return c.json(contacts)
  })

  .get('/messages', authMiddleware, async (c) => {
    const messages: MessageSchemaWithAuthorData[] = await getMessagesForChat()
    return c.json(messages)
  })

  .post('/message', authMiddleware, async (c) => {
    const formData = await c.req.formData()
    const image = formData.get('image') as ValidImage | null
    if (!image) {
      return c.json({ error: 'No file uploaded' }, 400)
    }
    const parseResult = imageSchema.safeParse(image)
    if (!parseResult.success) {
      return c.json({ error: parseResult.error.errors }, 400)
    }
    const url = await uploadImage(image)
    return c.json(url)
  })
