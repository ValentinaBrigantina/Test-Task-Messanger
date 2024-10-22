import { HTTPException } from 'hono/http-exception'
import { ne, eq } from 'drizzle-orm'

import { db } from '../db'
import {
  messages as messagesTable,
  type MessageSchemaInsert,
  type MessageSchemaSelect,
} from '../db/schema/messages'
import { users as usersTable } from '../db/schema/users'
import type {
  MessageSchemaWithAuthorData,
  UserProfile,
  WsTextDataFromApi,
} from '../sharedTypes'
import { getUserByID } from './user'
import { WsAction } from '../../frontend/src/utils/constants'
import { createUniqueName, getPath, getUrl, upload } from './upload'
import { UploadsDir } from '../helpers/constants'

export const saveMessage = async (
  data: MessageSchemaInsert
): Promise<MessageSchemaSelect> => {
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

export const getMessagesForChat = (): Promise<MessageSchemaWithAuthorData[]> =>
  db
    .select({
      id: messagesTable.id,
      text: messagesTable.text,
      createdAt: messagesTable.createdAt,
      author: {
        id: usersTable.id,
        name: usersTable.name,
        avatar: usersTable.avatar,
        role: usersTable.role,
      },
      isChat: messagesTable.isChat,
      target: messagesTable.target,
      channelID: messagesTable.channelID,
      src: messagesTable.src,
      type: messagesTable.type,
    })
    .from(messagesTable)
    .where(eq(messagesTable.isChat, true))
    .innerJoin(usersTable, eq(messagesTable.authorID, usersTable.id))
    .orderBy(messagesTable.createdAt)

export const getMessageWithAuthorProfile = async ({
  authorID,
  ...dataMessage
}: MessageSchemaSelect): Promise<WsTextDataFromApi> => {
  const { password, ...author } = await getUserByID(authorID)
  return {
    eventType: WsAction.UpdateChat,
    message: { ...dataMessage, author },
  }
}

export const uploadImage = async (file: File): Promise<string> => {
    const name = createUniqueName(file.name)
    const path = await getPath(name, UploadsDir.ChatImage)
    await upload(file, path)
    return getUrl(name, UploadsDir.ChatImage)
}
