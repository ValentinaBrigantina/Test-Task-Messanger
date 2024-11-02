import type { WSContext, WSMessageReceive } from 'hono/ws'
import { getContactsByChannelID, getPayloadToSend } from '../services/chat'
import type {
  AuthMessagePayloadApi,
  Channel,
  GroupChannelMessagePayloadApi,
  PrivateMessagePayloadApi,
  UserProfile,
  WsMessageTypeApi,
} from '../sharedTypes'
import { server, wsStore } from './../index'
import { WsAction } from './constants'
import { checkValidToken } from '../services/auth'

export type CustomWSContext = WSContext & { _userId?: string }

export const wsHandler = async (
  event: MessageEvent<WSMessageReceive>,
  ws: CustomWSContext
) => {
  const dataString = event.data as string
  const data: WsMessageTypeApi = JSON.parse(dataString)

  switch (data.eventType) {
    case WsAction.Auth:
      await wsHandlerAuthMessage(ws, data)
      break

    case WsAction.PrivateMessage:
      await wsHandlerPrivateMessage(data)
      break

    case WsAction.GroupChannelMessage:
      await wsHandlerGroupChannelMessage(data)
      break

    default:
      break
  }
}

async function wsHandlerAuthMessage(
  ws: CustomWSContext,
  data: WsMessageTypeApi
) {
  const authPayload = data.payload as AuthMessagePayloadApi
  const payload = await checkValidToken(authPayload.token)
  const id = (payload.id as number).toString()

  ws._userId = id
  wsStore.save(id, ws)
  const sender = wsStore.get(id)
  sender && sender.send(JSON.stringify({ message: 'success' }))
}

async function wsHandlerPrivateMessage(data: WsMessageTypeApi): Promise<void> {
  const privateMessagePayload = data.payload as PrivateMessagePayloadApi

  const targetContact = privateMessagePayload.targetID.toString()
  const author = privateMessagePayload.authorID.toString()

  const payloadToSendPrivateMessage = await getPayloadToSend(
    privateMessagePayload
  )

  const targetConnection = wsStore.get(targetContact)
  const senderConnection = wsStore.get(author)

  const dataToSend = {
    eventType: WsAction.PrivateMessage,
    payload: payloadToSendPrivateMessage,
  }

  targetConnection && targetConnection.send(JSON.stringify(dataToSend))
  senderConnection && senderConnection.send(JSON.stringify(dataToSend))
}

async function wsHandlerGroupChannelMessage(
  data: WsMessageTypeApi
): Promise<void> {
  const groupChannelMessagePayload =
    data.payload as GroupChannelMessagePayloadApi

  const payloadToSendGroupChannelMessage = await getPayloadToSend(
    groupChannelMessagePayload
  )

  const targetContacts = await getContactsByChannelID(
    groupChannelMessagePayload.channelID
  )

  const dataToSend = {
    eventType: WsAction.GroupChannelMessage,
    payload: payloadToSendGroupChannelMessage,
  }

  const authorId = groupChannelMessagePayload.authorID.toString()
  const senderConnection = wsStore.get(authorId)
  senderConnection && senderConnection.send(JSON.stringify(dataToSend))

  targetContacts.forEach((contact) => {
    const targetConnection = wsStore.get(contact.id.toString())
    targetConnection && targetConnection.send(JSON.stringify(dataToSend))
  })
}

export async function wsHandlerUpdateChannelsOfGroups(
  channelOfGroup: Channel
): Promise<void> {
  const contacts = await getContactsByChannelID(channelOfGroup.id)

  const dataToSend = {
    eventType: WsAction.UpdateChannelsOfGroups,
    payload: channelOfGroup,
  }

  contacts.forEach((contact) => {
    const targetConnection = wsStore.get(contact.id.toString())
    targetConnection && targetConnection.send(JSON.stringify(dataToSend))
  })
}

export function wsHandlerUpdateContacts(user: UserProfile): void {
  const dataToSend = {
    eventType: WsAction.UpdateContacts,
    payload: user,
  }

  server.publish(WsAction.UpdateContacts, JSON.stringify(dataToSend))
}
