import { z } from 'zod'
import type {
  MessageSchemaInsert,
  MessageSchemaSelect,
} from './db/schema/messages'
import { insertUserSchema, selectUserSchema } from './db/schema/users'
import { selectChannelSchema } from './db/schema/channels'
import type { WsAction } from './helpers/constants'
import { Role } from './helpers/getUser'

export const authUserData = insertUserSchema.pick({
  name: true,
  password: true,
})
export type AuthSchema = z.infer<typeof authUserData>

export const userID = selectUserSchema.pick({
  id: true,
})

export const createChannelOfGroupData = z.object({
  contacts: z.number().array(),
  name: z.string().trim().min(1).max(60)
})

export type CreateChannelOfGroupData = z.infer<typeof createChannelOfGroupData>

export type UserID = z.infer<typeof userID>

export const channelID = selectChannelSchema.pick({
  id: true,
})
export type ChannelID = z.infer<typeof channelID>

export const dataUpdatePassword = z.object({
  newPassword: z.string().min(2).max(20),
  currentPassword: z.string().min(2).max(20),
})
export type DataUpdatePassword = z.infer<typeof dataUpdatePassword>

export type JwtToken = {
  token: string
}

const userProfile = selectUserSchema.pick({
  id: true,
  name: true,
  avatar: true,
  role: true,
})
export type UserProfile = z.infer<typeof userProfile>

const payloadData = selectUserSchema.pick({
  id: true,
  role: true,
})
export type PayloadUserData = z.infer<typeof payloadData>

export type MessageSchemaWithAuthorData = Omit<
  MessageSchemaSelect,
  'authorID'
> & {
  author: UserProfile
}

export type PrivateMessagePayloadApi = Omit<MessageSchemaInsert, 'targetID'> & { targetID: number }
export type GroupChannelMessagePayloadApi = MessageSchemaInsert
export type AuthMessagePayloadApi = {
  token: string
}

export type WsMessageTypeApi = {
  eventType: WsAction
  payload: PrivateMessagePayloadApi | AuthMessagePayloadApi | GroupChannelMessagePayloadApi
}

export type PrivateMessagePayloadClient = Omit<MessageSchemaWithAuthorData, 'targetID'> & { targetID: number }

export type WsMessageTypeClient = {
  eventType: WsAction
  payload: Channel | UserProfile | PrivateMessagePayloadClient
}

export type Channel = z.infer<typeof selectChannelSchema>
