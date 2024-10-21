import type { WSContext, WSMessageReceive } from 'hono/ws'
import { getMessageWithAuthorProfile, saveMessage } from '../services/chat'
import { server } from '../index'
import { WsAction } from './constants'
import type { WsTextDataFromClient } from '../sharedTypes'
import type { MessageSchemaSelect } from '../db/schema/messages'

const readBlobData = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(blob)
  })
}

export const wsHandler = async (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext
) => {
  let dataMessage: string
  if (event.data instanceof Blob) {
    dataMessage = await readBlobData(event.data)
  } else if (typeof event.data === 'string') {
    dataMessage = event.data
  } else {
    throw new Error('Unsupported message format')
  }

  const data: WsTextDataFromClient = JSON.parse(dataMessage)
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
