import { HTTPException } from 'hono/http-exception'
import { ne, eq, inArray, count, and } from 'drizzle-orm'

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
  Channel,
  CreateChannelOfGroupData,
  GroupChannelMessagePayloadApi,
  MessageSchemaWithAuthorData,
  PrivateMessagePayloadApi,
  UserProfile,
} from '../sharedTypes'
import { getUserByID } from './user'
import { createUniqueName, getPath, getUrl, upload } from './upload'
import { UploadsDir } from '../helpers/constants'

export const saveMessage = async (
  data: MessageSchemaInsert
): Promise<MessageSchemaSelect> => {
  if (!data.channelID) {
    throw new HTTPException(400, {
      message: 'channelID required',
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

export const getChannelsOfGroupsWithUser = (id: number): Promise<Channel[]> =>
  db
    .select({
      id: channels.id,
      name: channels.name,
      isGroup: channels.isGroup,
    })
    .from(channels)
    .innerJoin(usersToChannels, eq(usersToChannels.channelID, channels.id))
    .where(and(eq(channels.isGroup, true), eq(usersToChannels.userID, id)))

export const createChannelOfGroup = async (
  data: CreateChannelOfGroupData
): Promise<Channel> => {
  const [channel] = await db
    .insert(channels)
    .values({ name: data.name, isGroup: true })
    .returning()
  await linkUsersToChannel(data.contacts, channel.id)
  return channel
}

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
      targetID: messages.targetID,
      channelID: messages.channelID,
      src: messages.src,
      type: messages.type,
    })
    .from(messages)
    .innerJoin(users, eq(messages.authorID, users.id))
    .where(eq(messages.channelID, channelID))
    .orderBy(messages.createdAt)

export const getMessageWithAuthorProfile = async ({
  authorID,
  ...dataMessage
}: MessageSchemaSelect): Promise<MessageSchemaWithAuthorData> => {
  const { password, ...author } = await getUserByID(authorID)
  return { ...dataMessage, author }
}

export const uploadImage = async (file: File): Promise<string> => {
  const name = createUniqueName(file.name)
  const path = await getPath(name, UploadsDir.ChatImage)
  await upload(file, path)
  return getUrl(name, UploadsDir.ChatImage)
}

const linkUsersToChannel = (userIDs: number[], channelID: number) =>
  db.insert(usersToChannels).values(
    userIDs.map((userID) => ({
      userID: userID,
      channelID: channelID,
    }))
  )

export const getOrCreatePrivateChannel = async (
  userIDs: number[]
): Promise<Channel> => {
  const [channel] = await db
    .select({ id: channels.id, name: channels.name, isGroup: channels.isGroup })
    .from(channels)
    .innerJoin(usersToChannels, eq(channels.id, usersToChannels.channelID))
    .where(
      and(inArray(usersToChannels.userID, userIDs), eq(channels.isGroup, false))
    )
    .groupBy(channels.id, channels.name, channels.isGroup)
    .having(eq(count(usersToChannels.userID), userIDs.length))

  if (!channel) {
    return createPrivateChannel(userIDs)
  }
  return channel
}

export const createPrivateChannel = async (
  userIDs: number[]
): Promise<Channel> => {
  const [channel] = await db
    .insert(channels)
    .values({ isGroup: false })
    .returning()
  await linkUsersToChannel(userIDs, channel.id)
  return channel
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

export const getTargetContactByChannelId = async (
  userId: number,
  channelId: number
): Promise<UserProfile> => {
  const [contact] = await db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
      role: users.role,
    })
    .from(users)
    .innerJoin(usersToChannels, eq(users.id, usersToChannels.userID))
    .innerJoin(channels, eq(usersToChannels.channelID, channels.id))
    .where(
      and(
        eq(usersToChannels.channelID, channelId),
        eq(channels.isGroup, false),
        ne(usersToChannels.userID, userId)
      )
    )
  return contact
}

export const getPayloadToSend = async (
  payload: GroupChannelMessagePayloadApi | PrivateMessagePayloadApi
): Promise<MessageSchemaWithAuthorData> => {
  const savedMessage: MessageSchemaSelect = await saveMessage(payload)
  return getMessageWithAuthorProfile(savedMessage)
}
