import type { WSContext, WSMessageReceive } from 'hono/ws'
import { getMessageWithAuthorProfile, saveMessage } from '../services/chat'
import { server } from '../index'
import { WsActions } from './constants'
import type { WsTextDataFromClient } from '../sharedTypes'
import type {
  MessageSchemaSelect,
} from '../db/schema/messages'

export const wsHandler = async (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext
) => {
  if (typeof event.data === 'string') {
    const data: WsTextDataFromClient = JSON.parse(event.data)
    switch (data.eventType) {
      case WsActions.UpdateChat:
        const savedMessage: MessageSchemaSelect = await saveMessage(data)
        const messageToSend = await getMessageWithAuthorProfile(savedMessage)
        server.publish(WsActions.UpdateChat, JSON.stringify(messageToSend))
        break

      default:
        break
    }
  }
}

export const createPrivateChannelId = (
  channelPrefix: WsActions.PrivateMessage,
  ...userIds: string[]
): string => {
  const sortedUsersIds = userIds.sort((a, b) => parseInt(a) - parseInt(b))
  const postfix = sortedUsersIds.join(':')
  return `${channelPrefix}:${postfix}`
}
