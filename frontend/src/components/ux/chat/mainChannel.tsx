import { SendMessageForm } from '@/components/ux/chat/sendMessageForm'
import { Messages } from '@/components/ux/chat/messages'
import { UserProfile } from '@server/sharedTypes'
import { useContext } from 'react'
import { CurrentContactContext } from '@/routes/_authenticated/_chatLayout'

interface IMainChatProps {}

export function MainChannel({}: IMainChatProps) {
  const targetContact: UserProfile | null = useContext(CurrentContactContext)
  console.log('targetContact: ', targetContact)

  return (
    <div className="basic-3/4 flex-auto">
      <h1 className="text-xl leading-9 tracking-tight text-primary">
        Channel with {targetContact?.name}
      </h1>
      <div className="container px-0 overflow-auto h-4/5 flex flex-col-reverse shadow-xl rounded-md">
        <div className=" bg-neutral-700 flex flex-col justify-end">
          <Messages />
          <SendMessageForm />
        </div>
      </div>
    </div>
  )
}
