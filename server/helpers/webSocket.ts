import type { ServerWebSocket } from 'bun'
import type { WSContext, WSMessageReceive } from 'hono/ws'
import { getMessageWithAuthorProfile, saveMessage } from '../services/chat'
import { server } from '../index'
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

  switch (data.eventType) {
    case topicPrivateMessage:
      const savedMessage: MessageSchemaSelect = await saveMessage(data.message)
      const messageToSend: WsTextDataFromApi =
        await getMessageWithAuthorProfile(savedMessage, topicPrivateMessage)
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
