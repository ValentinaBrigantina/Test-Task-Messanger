import type { ServerWebSocket } from 'bun'
import type { WSContext, WSMessageReceive } from 'hono/ws'
import { getMessageWithAuthorProfile, saveMessage } from '../services/chat'
import { server } from '../index'
import { WsAction } from './constants'
import type { WsTextDataFromApi, WsTextDataFromClient } from '../sharedTypes'
import type { MessageSchemaSelect } from '../db/schema/messages'
import { createPrivateChannelTopic } from './utils/createPrivateChannelId'

export const wsHandler = async (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext
) => {
  const dataString = event.data as string
  const data: WsTextDataFromClient = JSON.parse(dataString)
  const topicPrivateMessage = createPrivateChannelTopic(data.message?.channelID)

  let messageToSend: WsTextDataFromApi | null = null
  let savedMessage: MessageSchemaSelect | null = null

  switch (data.eventType) {
    case WsAction.UpdateChat:
      savedMessage = await saveMessage(data.message)
      messageToSend = await getMessageWithAuthorProfile(
        savedMessage,
        WsAction.UpdateChat
      )
      server.publish(WsAction.UpdateChat, JSON.stringify(messageToSend))
      break

    case topicPrivateMessage:
      savedMessage = await saveMessage(data.message)
      messageToSend = await getMessageWithAuthorProfile(
        savedMessage,
        topicPrivateMessage
      )
      const rawWs = ws.raw as ServerWebSocket
      if (!rawWs.isSubscribed(topicPrivateMessage)) {
        rawWs.subscribe(topicPrivateMessage)
      }
      server.publish(topicPrivateMessage, JSON.stringify(messageToSend))
      break

    default:
      break
  }
}
