import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { SendMessageForm } from '@/components/ux/chat/sendMessageForm'
import { CurrentContactContext } from '@/routes/_authenticated/_chatLayout'
import { MessagesChannel } from './messagesChannel'
import { getChannelQueryOptions } from '@/lib/api'

export function MainChannel() {
  const context = useContext(CurrentContactContext)
  let channel
  const ChannelQuery = useQuery(
    getChannelQueryOptions({ id: context?.currentTargetContact?.id as number })
  )
  if (ChannelQuery) {
    channel = ChannelQuery.data
  }

  const handleOnClick = () => {
    context && context.setCurrentTargetContact(null)
  }

  return (
    <div className="basic-3/4 flex-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl leading-9 tracking-tight text-primary">
          Channel with {context && context.currentTargetContact?.name}
        </h1>
        <Link onClick={handleOnClick} className="text-ring" to="/chat/">
          ← Back to general chat
        </Link>
      </div>

      <div className="container px-0 overflow-auto h-4/5 flex flex-col-reverse shadow-xl rounded-md">
        <div className=" bg-neutral-700 flex flex-col justify-end">
          {channel && <MessagesChannel channelId={channel} />}
          <SendMessageForm channel={channel} />
        </div>
      </div>
    </div>
  )
}
