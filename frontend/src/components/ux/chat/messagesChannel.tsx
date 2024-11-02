import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  Channel,
  MessageSchemaWithAuthorData,
  PrivateMessagePayloadClient,
  WsMessageTypeClient,
} from '@server/sharedTypes'
import { formatDate, IDate } from '@/utils/helpers.ts/formatDate'
import { Message } from './message'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { MessageSkeleton } from './skeletons/messageSkeleton'
import { getChannelMessagesQueryOptions } from '@/lib/api'
import { WsAction } from '@/utils/constants'

interface IMessageChannelProps {
  channel: Channel
}

export function MessagesChannel({ channel }: IMessageChannelProps) {
  const { isConnected, subscribe } = useWebSocket()
  const queryClient = useQueryClient()
  const messagesQuery = useQuery(getChannelMessagesQueryOptions(channel))
  const [messages, setMessages] = useState<MessageSchemaWithAuthorData[]>([])
  const isWsReady = isConnected()

  useEffect(() => {
    setMessages([])
    queryClient.invalidateQueries({
      queryKey: getChannelMessagesQueryOptions(channel).queryKey,
      exact: true,
    })
  }, [channel, queryClient])

  useEffect(() => {
    if (messagesQuery.data?.length) {
      setMessages(messagesQuery.data)
    }
  }, [messagesQuery.data])

  useEffect(() => {
    if (isWsReady) {
      subscribe((event) => {
        const data: WsMessageTypeClient = JSON.parse(event.data)

        switch (data.eventType) {
          case WsAction.PrivateMessage:
            const privateMessagePayload =
              data.payload as PrivateMessagePayloadClient
            if (privateMessagePayload.channelID === channel.id) {
              setMessages((prevMessages) =>
                prevMessages.some(
                  (message) => message.id === privateMessagePayload.id
                )
                  ? prevMessages
                  : [...prevMessages, privateMessagePayload]
              )
            }
            break

          case WsAction.GroupChannelMessage:
            const groupChannelMessagePayload =
              data.payload as MessageSchemaWithAuthorData
            if (groupChannelMessagePayload.channelID === channel.id) {
              setMessages((prevMessages) =>
                prevMessages.some(
                  (message) => message.id === groupChannelMessagePayload.id
                )
                  ? prevMessages
                  : [...prevMessages, groupChannelMessagePayload]
              )
            }
            break

          default:
            break
        }
      })
    }
  }, [channel, subscribe, isWsReady])

  return (
    <ul>
      {messagesQuery.isLoading &&
        Array.from({ length: 7 }).map((_, index) => (
          <MessageSkeleton key={index} />
        ))}
      {messages.map((message) => {
        const date: IDate = message.createdAt
          ? formatDate(message.createdAt)
          : { day: '', time: '' }
        return <Message message={message} date={date} key={message.id} />
      })}
      {messages.length === 0 && messagesQuery.isFetched && (
        <p className="text-ring mx-2 my-5">Be the first to write a message!</p>
      )}
    </ul>
  )
}
