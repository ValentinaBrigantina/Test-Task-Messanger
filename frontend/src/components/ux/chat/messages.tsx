import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { MessageSchema, WsTextDataFromApi } from '@server/sharedTypes'
import { getMessagesQueryOptions } from '@/lib/api'
import { formatDate, IDate } from '@/utils/helpers.ts/formatDate'
import { Message } from './message'
import { WsActions } from '@/utils/constants'
import { useWebSocket } from '@/utils/hooks/useWebSocket'

export function Messages() {
  const { isConnected, subscribe } = useWebSocket()
  const queryClient = useQueryClient()
  const messagesQuery = useQuery(getMessagesQueryOptions)
  const [messages, setMessages] = useState<MessageSchema[]>([])
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
          case WsActions.UpdateChat:
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
      {messages.map((message) => {
        const date: IDate = message.createdAt
          ? formatDate(message.createdAt)
          : { day: '', time: '' }
        return <Message message={message} date={date} key={message.id} />
      })}
    </ul>
  )
}
