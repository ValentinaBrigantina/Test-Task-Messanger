import { SendMessageForm } from '@/components/ux/chat/sendMessageForm'
import { Messages } from '@/components/ux/chat/messages'

interface IMainChatProps {
}

export function MainChat({}: IMainChatProps) {
  return (
    <div className="container px-0 overflow-auto h-[520px] flex flex-col-reverse">
      <div className=" bg-neutral-700 flex flex-col justify-end">
        <Messages />
        <SendMessageForm />
      </div>
    </div>
  )
}
