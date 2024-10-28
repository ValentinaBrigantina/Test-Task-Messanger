import { HTTPException } from 'hono/http-exception'
import { ne, eq, inArray, count } from 'drizzle-orm'

import { db } from '../db'
import {
  messages as messagesTable,
  type MessageSchemaInsert,
  type MessageSchemaSelect,
} from '../db/schema/messages'
import { users as usersTable } from '../db/schema/users'
import { channels as channelsTable } from '../db/schema/channels'
import { usersToChannels as usersToChannelsTable } from '../db/schema/usersToChannels'
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
  if (!data.channelID && !data.targetID && !data.isChat) {
    throw new HTTPException(400, {
      message: 'channelID or targetID required if not chat',
    })
  }
  const [message] = await db.insert(messagesTable).values(data).returning()
  return message
}

const contactsSelect = db
  .select({
    id: usersTable.id,
    name: usersTable.name,
    avatar: usersTable.avatar,
    role: usersTable.role,
  })
  .from(usersTable)

export const getContactsWithoutAuthor = (id: number): Promise<UserProfile[]> =>
  contactsSelect.where(ne(usersTable.id, id))

const messageWithAuthorSelect = db
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
    targetID: messagesTable.targetID,
    channelID: messagesTable.channelID,
    src: messagesTable.src,
    type: messagesTable.type,
  })
  .from(messagesTable)
  .innerJoin(usersTable, eq(messagesTable.authorID, usersTable.id))

export const getMessagesForChat = (): Promise<MessageSchemaWithAuthorData[]> =>
  messageWithAuthorSelect
    .where(eq(messagesTable.isChat, true))
    .orderBy(messagesTable.createdAt)

export const getMessagesForChannel = (
  channelID: number
): Promise<MessageSchemaWithAuthorData[]> =>
  messageWithAuthorSelect.where(eq(messagesTable.channelID, channelID))

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

const getChannelByUserIDs = (userIDs: number[]) =>
  db
    .select({ channelID: usersToChannelsTable.channelID })
    .from(usersToChannelsTable)
    .innerJoin(
      channelsTable,
      eq(usersToChannelsTable.channelID, channelsTable.id)
    )
    .where(inArray(usersToChannelsTable.userID, userIDs))
    .groupBy(usersToChannelsTable.channelID)
    .having(eq(count(usersToChannelsTable.userID), userIDs.length))

const createChannel = () =>
  db.insert(channelsTable).values({}).returning({ id: channelsTable.id })

const linkUsersToChannel = (userIDs: number[], channelID: number) =>
  db.insert(usersToChannelsTable).values(
    userIDs.map((userID) => ({
      userID: userID,
      channelID: channelID,
    }))
  )

export const getOrCreateChannel = async (
  userIDs: number[]
): Promise<number> => {
  const [channel] = await getChannelByUserIDs(userIDs)
  let channelID: number
  if (!channel) {
    const [newChannel] = await createChannel()
    channelID = newChannel.id
    await linkUsersToChannel(userIDs, channelID)
  } else {
    channelID = channel.channelID
  }
  return channelID
}

export const getContactsByChannelID = (
  channelID: number
): Promise<UserProfile[]> =>
  contactsSelect
    .innerJoin(
      usersToChannelsTable,
      eq(usersTable.id, usersToChannelsTable.userID)
    )
    .where(eq(usersToChannelsTable.channelID, channelID))
