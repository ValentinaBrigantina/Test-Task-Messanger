import { useContext } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CurrentChannelContext } from '../_chatLayout'
import { MainChannel } from '@/components/ux/chat/mainChannel'

const ChatIndex = () => {
  const context = useContext(CurrentChannelContext)
  if (context?.currentTargetChannel) {
    return <MainChannel />
  }
  return (
    <div className="basic-3/4 flex-auto">
      <div className="flex items-center justify-center">
        <h1 className="text-ring">Select a contact to start chatting</h1>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/_chatLayout/chat')({
  component: ChatIndex,
})
