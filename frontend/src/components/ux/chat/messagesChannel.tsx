import { useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
    ChannelID,
  MessageSchemaWithAuthorData,
  WsTextDataFromApi,
} from '@server/sharedTypes'
import { formatDate, IDate } from '@/utils/helpers.ts/formatDate'
import { Message } from './message'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { MessageSkeleton } from './skeletons/messageSkeleton'
import { getChannelMessagesQueryOptions } from '@/lib/api'
import { CurrentContactContext } from '@/routes/_authenticated/_chatLayout'
import { createPrivateChannelId } from '@/utils/helpers.ts/createPrivateChannelId'

interface IMessageChannelProps {
    channelId: ChannelID
}

export function MessagesChannel({ channelId }: IMessageChannelProps) {
  const { isConnected, subscribe } = useWebSocket()
  const queryClient = useQueryClient()
  const targetContact = useContext(CurrentContactContext)
  const messagesQuery = useQuery(getChannelMessagesQueryOptions(channelId))
  const [messages, setMessages] = useState<MessageSchemaWithAuthorData[]>([])
  const isWsReady = isConnected()

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: getChannelMessagesQueryOptions(channelId).queryKey,
        exact: true,
      })
    }
  }, [])

  useEffect(() => {
    if (messagesQuery.data?.length) {
      setMessages(messagesQuery.data)
    }
  }, [messagesQuery.data, targetContact])

  useEffect(() => {
    if (messages.length && isWsReady) {
      subscribe((event) => {
        const data: WsTextDataFromApi = JSON.parse(event.data)

        const topicPrivateChannel = createPrivateChannelId(channelId.id)

        switch (data.eventType) {
          case topicPrivateChannel:
            setMessages((prevMessages) => [...prevMessages, data.message])
            break

          default:
            break
        }
      })
    }
  }, [messages, isWsReady, channelId])

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
