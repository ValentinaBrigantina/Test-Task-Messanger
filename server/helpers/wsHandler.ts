import type { WSContext, WSMessageReceive } from 'hono/ws'
import { getMessageWithAuthorProfile, saveMessage } from '../services/chat'
import { server } from '../index'
import { Ws } from './constants'
import type { WsTextDataFromClient } from '../sharedTypes'
import type { MessageSchemaInsert, MessageSchemaSelect } from '../db/schema/messages'

export const wsHandler = async (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext
) => {
  if (typeof event.data === 'string') {
    const data: WsTextDataFromClient = JSON.parse(event.data)
    switch (data.eventType) {
      case Ws.Chat:
        const savedMessage: MessageSchemaSelect = await saveMessage(data)
        const messageToSend = await getMessageWithAuthorProfile(savedMessage)
        server.publish(Ws.Chat, JSON.stringify(messageToSend))
        break

      default:
        break
    }
  }
}
