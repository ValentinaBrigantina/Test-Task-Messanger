import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SendMessageForm } from '@/components/ux/chat/sendMessageForm'
import { CurrentChannelContext } from '@/routes/_authenticated/_chatLayout'
import { MessagesChannel } from './messagesChannel'
import { getTargetContactByChannelIdQueryOptions } from '@/lib/api'

export function MainChannel() {
  const context = useContext(CurrentChannelContext)
  const targetContactQuery = context?.currentTargetChannel &&
    useQuery(getTargetContactByChannelIdQueryOptions(context?.currentTargetChannel))


  // const handleOnClick = () => {
  //   context && context.setCurrentTargetContact(null)
  // }

  return (
    <div className="basic-3/4 flex-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-lg leading-9 tracking-tight text-ring">
          {context && context?.currentTargetChannel?.isGroup ? `Channel ${context?.currentTargetChannel?.name}`:
          `Channel with ${targetContactQuery && targetContactQuery.data?.name}`}
        </h1>
        {/* <Link onClick={handleOnClick} className="text-ring" to="/chat/">
          ← Back to general chat
        </Link> */}
      </div>

      <div className="container px-0 overflow-auto h-4/5 flex flex-col-reverse shadow-xl rounded-md">
        <div className=" bg-neutral-700 flex flex-col justify-end">
          {context?.currentTargetChannel && <MessagesChannel channel={context?.currentTargetChannel} />}
          {context?.currentTargetChannel && <SendMessageForm channel={context?.currentTargetChannel} />}
        </div>
      </div>
    </div>
  )
}
