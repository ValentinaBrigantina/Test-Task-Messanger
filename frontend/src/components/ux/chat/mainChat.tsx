import { SendMessageForm } from '@/components/ux/chat/sendMessageForm'
import { Messages } from '@/components/ux/chat/messages'

interface IMainChatProps {
  isConnected: boolean
  sendWSdata: (data: Record<string, any>) => void
  connection: WebSocket | undefined
}

export function MainChat({
  isConnected,
  sendWSdata,
  connection,
}: IMainChatProps) {
  return (
    <div className="container px-0 overflow-auto h-[520px] flex flex-col-reverse">
      <div className=" bg-neutral-700 flex flex-col justify-end">
        <Messages connection={connection} />
        <SendMessageForm isWSReady={isConnected} sendWSdata={sendWSdata} />
      </div>
    </div>
  )
}
