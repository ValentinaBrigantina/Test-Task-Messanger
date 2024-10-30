import { HTTPException } from 'hono/http-exception'
import { ne, eq, inArray, count } from 'drizzle-orm'

import { db } from '../db'
import {
  messages,
  type MessageSchemaInsert,
  type MessageSchemaSelect,
} from '../db/schema/messages'
import { users } from '../db/schema/users'
import { channels } from '../db/schema/channels'
import { usersToChannels } from '../db/schema/usersToChannels'
import type {
  ChannelID,
  MessageSchemaWithAuthorData,
  UserProfile,
  WsTextDataFromApi,
} from '../sharedTypes'
import { getUserByID } from './user'
import { createUniqueName, getPath, getUrl, upload } from './upload'
import { UploadsDir } from '../helpers/constants'
import { createPrivateChannelId } from '../helpers/utils/createPrivateChannelId'

export const saveMessage = async (
  data: MessageSchemaInsert
): Promise<MessageSchemaSelect> => {
  if (!data.channelID && !data.targetID && !data.isChat) {
    throw new HTTPException(400, {
      message: 'channelID or targetID required if not chat',
    })
  }
  const [message] = await db.insert(messages).values(data).returning()
  return message
}

export const getContactsWithoutAuthor = (id: number): Promise<UserProfile[]> =>
  db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
      role: users.role,
    })
    .from(users)
    .where(ne(users.id, id))

export const getMessagesForChat = (): Promise<MessageSchemaWithAuthorData[]> =>
  db
    .select({
      id: messages.id,
      text: messages.text,
      createdAt: messages.createdAt,
      author: {
        id: users.id,
        name: users.name,
        avatar: users.avatar,
        role: users.role,
      },
      isChat: messages.isChat,
      targetID: messages.targetID,
      channelID: messages.channelID,
      src: messages.src,
      type: messages.type,
    })
    .from(messages)
    .innerJoin(users, eq(messages.authorID, users.id))
    .where(eq(messages.isChat, true))
    .orderBy(messages.createdAt)

export const getMessagesForChannel = (
  channelID: number
): Promise<MessageSchemaWithAuthorData[]> =>
  db
    .select({
      id: messages.id,
      text: messages.text,
      createdAt: messages.createdAt,
      author: {
        id: users.id,
        name: users.name,
        avatar: users.avatar,
        role: users.role,
      },
      isChat: messages.isChat,
      targetID: messages.targetID,
      channelID: messages.channelID,
      src: messages.src,
      type: messages.type,
    })
    .from(messages)
    .innerJoin(users, eq(messages.authorID, users.id))
    .where(eq(messages.channelID, channelID))

export const getMessageWithAuthorProfile = async (
  { authorID, ...dataMessage }: MessageSchemaSelect,
  topic: string
): Promise<WsTextDataFromApi> => {
  const { password, ...author } = await getUserByID(authorID)
  return {
    eventType: topic,
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
    .select({ channelID: usersToChannels.channelID })
    .from(usersToChannels)
    .innerJoin(channels, eq(usersToChannels.channelID, channels.id))
    .where(inArray(usersToChannels.userID, userIDs))
    .groupBy(usersToChannels.channelID)
    .having(eq(count(usersToChannels.userID), userIDs.length))

const linkUsersToChannel = (userIDs: number[], channelID: number) =>
  db.insert(usersToChannels).values(
    userIDs.map((userID) => ({
      userID: userID,
      channelID: channelID,
    }))
  )

export const getChannel = async (userIDs: number[]): Promise<ChannelID> => {
  const [channel] = await getChannelByUserIDs(userIDs)
  if (!channel) {
    throw new HTTPException(404)
  }
  return { id: channel.channelID }
}

export const createChannel = async (userIDs: number[]): Promise<ChannelID> => {
  const id = createPrivateChannelId(userIDs)
  const [channel] = await db
    .insert(channels)
    .values({ id: parseInt(id) })
    .returning({ id: channels.id })
  await linkUsersToChannel(userIDs, channel.id)
  return { id: channel.id }
}

export const getContactsByChannelID = (
  channelID: number
): Promise<UserProfile[]> =>
  db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
      role: users.role,
    })
    .from(users)
    .innerJoin(usersToChannels, eq(users.id, usersToChannels.userID))
    .where(eq(usersToChannels.channelID, channelID))
