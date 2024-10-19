import { createFileRoute } from '@tanstack/react-router'
import { Contacts } from '@/components/ux/chat/contacts'
import { MainChat } from '@/components/ux/chat/mainChat'
import { useWebSocket } from '@/utils/hooks/useWebSocket'

export const Route = createFileRoute('/_authenticated/chat')({
  component: Chat,
})

export function Chat() {
  const { isConnected, send, connection } = useWebSocket()

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 pb-12 pt-5 lg:px-8">
      <div className="mt-4 p-2 sm:mx-auto sm:w-full h-[620px] flex flex-row space-x-6 bg-neutral-700 scroll-smooth">
        <Contacts />
        <div className="basic-3/4">
          <div className="sm:w-full sm:max-w-sm">
            <h1 className="text-xl leading-9 tracking-tight text-gray-100">
              Chat
            </h1>
          </div>
          <MainChat
            isConnected={isConnected}
            sendWSdata={send}
            connection={connection}
          />
        </div>
      </div>
    </div>
  )
}
