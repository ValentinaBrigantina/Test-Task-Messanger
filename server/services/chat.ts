import { HTTPException } from 'hono/http-exception'
import { db } from '../db'
import { messages as messagesTable } from '../db/schema/messages'
import type { MessageSchema } from '../sharedTypes'

export const saveMessage = async (data: MessageSchema) => {
  if (!data.channelID && !data.target) {
    throw new HTTPException(400, { message: 'channelID or target required' })
  }
  const [message] = await db.insert(messagesTable).values(data).returning()
  return message
}
