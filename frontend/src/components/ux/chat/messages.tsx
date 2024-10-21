import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import {
  MessageSchemaWithAuthorData,
  WsTextDataFromApi,
} from '@server/sharedTypes'
import { getMessagesQueryOptions } from '@/lib/api'
import { formatDate, IDate } from '@/utils/helpers.ts/formatDate'
import { Message } from './message'
import { WsAction } from '@/utils/constants'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { MessageSkeleton } from './skeletons/messageSkeleton'

export function Messages() {
  const { isConnected, subscribe } = useWebSocket()
  const queryClient = useQueryClient()
  const messagesQuery = useQuery(getMessagesQueryOptions)
  const [messages, setMessages] = useState<MessageSchemaWithAuthorData[]>([])
  const isWsReady = isConnected()

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: getMessagesQueryOptions.queryKey,
        exact: true,
      })
    }
  }, [])

  useEffect(() => {
    if (messagesQuery.data?.length) {
      setMessages(messagesQuery.data)
    }
  }, [messagesQuery.data])

  useEffect(() => {
    if (messages.length && isWsReady) {
      subscribe((event) => {
        const data: WsTextDataFromApi = JSON.parse(event.data)

        switch (data.eventType) {
          case WsAction.UpdateChat:
            setMessages([...messages, data.message])
            break

          default:
            break
        }
      })
    }
  }, [messages, isWsReady])

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
