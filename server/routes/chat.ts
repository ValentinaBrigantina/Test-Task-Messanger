import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authMiddleware } from '../helpers/bearerAuth'
import { getUser } from '../helpers/getUser'
import {
  createChannel,
  getChannel,
  getContactsWithoutAuthor,
  getMessagesForChannel,
  getMessagesForChat,
  uploadImage,
} from '../services/chat'
import {
  type MessageSchemaWithAuthorData,
  type UserProfile,
} from '../sharedTypes'
import {
  imageSchema,
  type ValidImage,
} from '../helpers/customValidation/imageSchema'


const app = new Hono()

app.use(authMiddleware)

export const chatRoute = app

  .get('/contacts', getUser, async (c) => {
    const { id } = c.var.user
    const contacts: UserProfile[] = await getContactsWithoutAuthor(id)
    return c.json(contacts)
  })

  .get('/messages', async (c) => {
    const messages: MessageSchemaWithAuthorData[] = await getMessagesForChat()
    return c.json(messages)
  })

  .post('/message', async (c) => {
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

  .get(
    '/channel',
    getUser,
    zValidator(
      'query',
      z.object({
        contact: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.var.user
      const { contact } = c.req.valid('query')
      const channelID = await getChannel([id, parseInt(contact)])
      return c.json(channelID)
    }
  )

  .post(
    '/channel',
    getUser,
    zValidator(
      'query',
      z.object({
        contact: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.var.user
      const { contact } = c.req.valid('query')
      const channelID = await createChannel([id, parseInt(contact)])
      return c.json(channelID)
    }
  )

  .get('/channel/:id{[0-9]+}', async (c) => {
    const id = Number.parseInt(c.req.param('id'))
    const messages = await getMessagesForChannel(id)
    return c.json(messages)
  })
