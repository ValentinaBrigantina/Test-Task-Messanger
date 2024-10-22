import type { WSContext, WSMessageReceive } from 'hono/ws'
import { getMessageWithAuthorProfile, saveMessage } from '../services/chat'
import { server } from '../index'
import { WsAction } from './constants'
import type { WsTextDataFromClient } from '../sharedTypes'
import type { MessageSchemaSelect } from '../db/schema/messages'

export const wsHandler = async (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext
) => {
  const dataString = event.data as string
  const data: WsTextDataFromClient = JSON.parse(dataString)
  switch (data.eventType) {
    case WsAction.UpdateChat:
      const savedMessage: MessageSchemaSelect = await saveMessage(data.message)
      const messageToSend = await getMessageWithAuthorProfile(savedMessage)
      server.publish(WsAction.UpdateChat, JSON.stringify(messageToSend))
      break

    default:
      break
  }
}

export const createPrivateChannelId = (
  channelPrefix: WsAction.PrivateMessage,
  ...userIds: string[]
): string => {
  const sortedUsersIds = userIds.sort((a, b) => parseInt(a) - parseInt(b))
  const postfix = sortedUsersIds.join(':')
  return `${channelPrefix}:${postfix}`
}
