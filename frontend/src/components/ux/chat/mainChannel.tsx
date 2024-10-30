import { SendMessageForm } from '@/components/ux/chat/sendMessageForm'
import type { UserProfile } from '@server/sharedTypes'
import { useContext } from 'react'
import { CurrentContactContext } from '@/routes/_authenticated/_chatLayout'
import { MessagesChannel } from './messagesChannel'
import { getChannelQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export function MainChannel() {
  const targetContact: UserProfile | null = useContext(CurrentContactContext)
  if (!targetContact) return null

  const { data } = useQuery(
    getChannelQueryOptions({ id: targetContact?.id })
  )

  return (
    <div className="basic-3/4 flex-auto">
      <h1 className="text-xl leading-9 tracking-tight text-primary">
        Channel with {targetContact?.name}
      </h1>
      <div className="container px-0 overflow-auto h-4/5 flex flex-col-reverse shadow-xl rounded-md">
        <div className=" bg-neutral-700 flex flex-col justify-end">
          {data && <MessagesChannel channelId={data} />}
          <SendMessageForm channel={data} />
        </div>
      </div>
    </div>
  )
}
