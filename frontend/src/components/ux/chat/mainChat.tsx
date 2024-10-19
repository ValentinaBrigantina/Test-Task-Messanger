import { SendMessageForm } from '@/components/ux/chat/sendMessageForm'
import { Messages } from '@/components/ux/chat/messages'

interface IMainChatProps {}

export function MainChat({}: IMainChatProps) {
  return (
    <div className="basic-3/4">
      <h1 className="text-xl leading-9 tracking-tight text-gray-100">Chat</h1>
      <div className="container px-0 overflow-auto h-4/5 flex flex-col-reverse">
        <div className=" bg-neutral-700 flex flex-col justify-end">
          <Messages />
          <SendMessageForm />
        </div>
      </div>
    </div>
  )
}
