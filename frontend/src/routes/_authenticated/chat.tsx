import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'

import {
  contactsQueryOptions,
  getMessagesQueryOptions,
  userQueryOptions,
} from '@/lib/api'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { ChatContacts, IChatContactsProps } from '@/components/ux/chatContacts'
import {
  ISendMessageFormProps,
  SendMessageForm,
} from '@/components/ux/sendMessageForm'
import { IMessageSchema, Message } from '@/components/ux/message'
import {
  MessageSchema,
  WsTextDataFromApi,
  WsTextDataFromClient,
} from '@server/sharedTypes'
import { wsChat } from '@server/helpers/constants'

export const Route = createFileRoute('/_authenticated/chat')({
  component: Chat,
})

export function Chat() {
  const { data: contacts = [], isFetched: isContactsFetched } =
    useQuery(contactsQueryOptions)
  const { data: userData } = useQuery(userQueryOptions)
  const { data: messagesData = [] } = useQuery(getMessagesQueryOptions)
  const [messages, setMessages] = useState<MessageSchema[]>([])
  const { isConnected, send: sendWSdata, connection } = useWebSocket()

  useEffect(() => {
    if (messagesData.length) {
      setMessages(messagesData)
    }
  }, [messagesData])

  useEffect(() => {
    if (messages.length && connection) {
      connection.addEventListener('message', (event) => {
        const data: WsTextDataFromApi = JSON.parse(event.data)

        switch (data.eventType) {
          case wsChat:
            setMessages([...messages, data.message])
            break

          default:
            break
        }
      })
    }
  }, [messages, connection])

  const form = useForm({
    defaultValues: {
      text: '',
    },
    onSubmit: async ({ value }) => {
      if (isConnected && userData) {
        const messageData: WsTextDataFromClient = {
          ...value,
          eventType: wsChat,
          isChat: true,
          authorID: userData.user.id,
        }
        sendWSdata(messageData)
        form.setFieldValue('text', '')
      }
    },
  })

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 pb-12 pt-5 lg:px-8">
      <div className="mt-4 p-2 sm:mx-auto sm:w-full h-[620px] flex flex-row space-x-6 bg-neutral-700 scroll-smooth">
        {isContactsFetched && (
          <ChatContacts contacts={contacts as IChatContactsProps['contacts']} />
        )}
        <div className="basic-3/4">
          <div className="sm:w-full sm:max-w-sm">
            <h1 className="text-xl leading-9 tracking-tight text-gray-100">
              Chat
            </h1>
          </div>
          <div className="container px-0 overflow-auto h-[520px] flex flex-col-reverse">
            <div className=" bg-neutral-700 flex flex-col justify-end">
              <Message messages={messages as IMessageSchema['messages']} />
              <SendMessageForm
                isWSReady={isConnected}
                sendWSdata={sendWSdata}
                form={form as ISendMessageFormProps['form']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
