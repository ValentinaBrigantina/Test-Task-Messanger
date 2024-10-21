import { Hono } from 'hono'
import { authMiddleware } from '../helpers/bearerAuth'
import { getUser } from '../helpers/getUser'
import { getContacts, getMessagesForChat } from '../services/chat'
import type { MessageSchemaWithAuthorData, UserProfile } from '../sharedTypes'

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
