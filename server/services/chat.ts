import { HTTPException } from 'hono/http-exception'
import { ne, eq, and } from 'drizzle-orm'
import { db } from '../db'
import {
  messages as messagesTable,
  type MessageSchemaInsert,
} from '../db/schema/messages'
import { users as usersTable } from '../db/schema/users'
import type { MessageSchema, UserProfile } from '../sharedTypes'

export const saveMessage = async (
  data: MessageSchemaInsert
): Promise<MessageSchemaInsert> => {
  if (!data.channelID && !data.target && !data.isChat) {
    throw new HTTPException(400, {
      message: 'channelID or target required if not chat',
    })
  }
  const [message] = await db.insert(messagesTable).values(data).returning()
  return message
}

export const getContacts = (id: number): Promise<UserProfile[]> =>
  db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      avatar: usersTable.avatar,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(ne(usersTable.id, id))

export const getMessagesForChat = (): Promise<MessageSchema[]> =>
  db
    .select({
      id: messagesTable.id,
      text: messagesTable.text,
      createdAt: messagesTable.createdAt,
      authorID: {
        id: usersTable.id,
        name: usersTable.name,
        avatar: usersTable.avatar,
        role: usersTable.role,
      },
      isChat: messagesTable.isChat,
      target: messagesTable.target,
      channelID: messagesTable.channelID,
    })
    .from(messagesTable)
    .where(eq(messagesTable.isChat, true))
    .innerJoin(usersTable, eq(messagesTable.authorID, usersTable.id))
    .orderBy(messagesTable.createdAt)
