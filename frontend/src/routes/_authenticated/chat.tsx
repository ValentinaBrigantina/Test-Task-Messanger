import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { contactsQueryOptions, getMessagesQueryOptions, userQueryOptions } from '@/lib/api'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { useForm } from '@tanstack/react-form'
import { ChatContacts, IChatContactsProps } from '@/components/ux/chatContacts'
import {
  ISendMessageFormProps,
  SendMessageForm,
} from '@/components/ux/sendMessageForm'
import { IMessageSchema, Message } from '@/components/ux/message'

export const Route = createFileRoute('/_authenticated/chat')({
  component: Chat,
})

export function Chat() {
  const { data: contacts = [], isFetched: isContactsFetched } =
    useQuery(contactsQueryOptions)
  const [isWSReady, sendWSdata] = useWebSocket()
  const { data: userData } = useQuery(userQueryOptions)
  const { data: messages = [], refetch: refetchMessages } = useQuery(getMessagesQueryOptions)

  const form = useForm({
    defaultValues: {
      text: '',
    },
    onSubmit: async ({ value }) => {
      if (isWSReady) {
        const messageData = {
          isChat: true,
          authorID: userData?.user.id
        }
        sendWSdata({...value, ...messageData})
        form.setFieldValue('text', '')
        refetchMessages()
      }
    },
  })

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 pb-12 pt-5 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-100">
          Chat
        </h1>
      </div>

      <div className="mt-4 py-4 sm:mx-auto sm:w-full flex space-x-6 bg-neutral-700">
        {isContactsFetched && (
          <ChatContacts contacts={contacts as IChatContactsProps['contacts']} />
        )}
        <div className="basis-2/3 bg-neutral-700 flex flex-col justify-end">
          <Message messages={messages as IMessageSchema['messages']}/>
          <SendMessageForm
            isWSReady={isWSReady}
            sendWSdata={sendWSdata}
            form={form as ISendMessageFormProps['form']}
          />
        </div>
      </div>
    </div>
  )
}
