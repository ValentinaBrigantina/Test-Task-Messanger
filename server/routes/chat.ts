import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authMiddleware } from '../helpers/bearerAuth'
import { getUser } from '../helpers/getUser'
import {
  createChannelOfGroup,
  getOrCreatePrivateChannel,
  getChannelsOfGroupsWithUser,
  getContactsWithoutAuthor,
  getMessagesForChannel,
  getTargetContactByChannelId,
  uploadImage,
} from '../services/chat'
import {
  type Channel,
  type UserProfile,
  createChannelOfGroupData,
} from '../sharedTypes'
import {
  imageSchema,
  type ValidImage,
} from '../helpers/customValidation/imageSchema'
import { wsHandlerUpdateChannelsOfGroups } from '../helpers/webSocket'

const app = new Hono()

app.use(authMiddleware)

export const chatRoute = app

  .get('/contacts', getUser, async (c) => {
    const { id } = c.var.user
    const contacts: UserProfile[] = await getContactsWithoutAuthor(id)
    return c.json(contacts)
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
    c.status(201)
    return c.json(url)
  })

  .post(
    '/private-channel',
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
      const channelID = await getOrCreatePrivateChannel([id, parseInt(contact)])
      c.status(201)
      return c.json(channelID)
    }
  )

  .get('/channel/:id{[0-9]+}', async (c) => {
    const id = Number.parseInt(c.req.param('id'))
    const messages = await getMessagesForChannel(id)
    return c.json(messages)
  })

  .get('/channels-of-groups', getUser, async (c) => {
    const { id } = c.var.user
    const channels: Channel[] = await getChannelsOfGroupsWithUser(id)
    return c.json(channels)
  })

  .post(
    '/channels-of-groups',
    getUser,
    zValidator('json', createChannelOfGroupData),
    async (c) => {
      const { id } = c.var.user
      const data = c.req.valid('json')
      data.contacts.push(id)
      const channelOfGroup: Channel = await createChannelOfGroup(data)
      await wsHandlerUpdateChannelsOfGroups(channelOfGroup)
      c.status(201)
      return c.json(channelOfGroup)
    }
  )

  .get('/target-contact/:id{[0-9]+}', getUser, async (c) => {
    const idChannel = Number.parseInt(c.req.param('id'))
    const { id } = c.var.user
    const targetContact = await getTargetContactByChannelId(id, idChannel)
    return c.json(targetContact)
  })
