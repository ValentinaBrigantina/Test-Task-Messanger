import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { MessageSchema, WsTextDataFromApi } from '@server/sharedTypes'
import { getMessagesQueryOptions } from '@/lib/api'
import { formatDate, IDate } from '@/utils/helpers.ts/formatDate'
import { Message } from './message'
import { Ws } from '@/utils/constants'

interface IMessagesProps {
  connection: WebSocket | undefined
}
export function Messages({ connection }: IMessagesProps) {
  const queryClient = useQueryClient()
  const messagesQuery = useQuery(getMessagesQueryOptions)
  const [messages, setMessages] = useState<MessageSchema[]>([])

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
    if (messages.length && connection) {
      connection.addEventListener('message', (event) => {
        const data: WsTextDataFromApi = JSON.parse(event.data)

        switch (data.eventType) {
          case Ws.Chat:
            setMessages([...messages, data.message])
            break

          default:
            break
        }
      })
    }
  }, [messages, connection])

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
