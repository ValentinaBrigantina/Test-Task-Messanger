import type { WSContext, WSMessageReceive } from 'hono/ws'
import {
  getContactsByChannelID,
  getMessageWithAuthorProfile,
  saveMessage,
} from '../services/chat'
import { server } from '../index'
import { WsAction } from './constants'
import type { WsTextDataFromApi, WsTextDataFromClient } from '../sharedTypes'
import type { MessageSchemaSelect } from '../db/schema/messages'

export const wsHandler = async (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext
) => {
  const dataString = event.data as string
  const data: WsTextDataFromClient = JSON.parse(dataString)
  let savedMessage: MessageSchemaSelect
  let messageToSend: WsTextDataFromApi

  switch (data.eventType) {
    case WsAction.UpdateChat:
      savedMessage = await saveMessage(data.message)
      messageToSend = await getMessageWithAuthorProfile(savedMessage)
      server.publish(WsAction.UpdateChat, JSON.stringify(messageToSend))
      break

    case WsAction.PrivateMessage:
      const channelID = data.message.channelID
      if (!channelID) {
        throw new Error('For private messages, channel ID is required')
      }
      const contacts = await getContactsByChannelID(channelID)
      const contacIDs = contacts.map((contact) => contact.id)
      const privateChannelId = createPrivateChannelId(contacIDs)
      console.log('privateChannelId: ', privateChannelId)
      savedMessage = await saveMessage(data.message)
      messageToSend = await getMessageWithAuthorProfile(savedMessage)
      server.publish(privateChannelId, JSON.stringify(messageToSend))
      break

    default:
      break
  }
}

export const createPrivateChannelId = (userIDs: number[]): string => {
  const channelPrefix = WsAction.PrivateMessage
  const sortedUsersIDs = userIDs.sort((a, b) => (a) - (b))
  const postfix = sortedUsersIDs.join(':')
  return `${channelPrefix}:${postfix}`
}
