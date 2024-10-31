import { useContext } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { CurrentChannelContext } from '@/routes/_authenticated/_chatLayout'
import type { Channel } from '@server/sharedTypes'

interface IChannelOfGroupProps {
  channel: Channel
}

export function ChannelOfGroup({ channel }: IChannelOfGroupProps) {
  const navigate = useNavigate()
  const context = useContext(CurrentChannelContext)

  const handleClick = () => {
    context?.setCurrentTargetChannel && context.setCurrentTargetChannel(channel)
    navigate({ to: `/chat/${channel?.id}` })
  }

  const isCurrentChannel = context?.currentTargetChannel?.id === channel?.id

  return (
    <li className="my-1" onClick={handleClick}>
      <Card
        className={`bg-background cursor-pointer rounded-md ${isCurrentChannel ? 'border-2' : 'border-background'}`}
      >
        <CardContent className="p-3">
          <div>{channel?.name}</div>
        </CardContent>
      </Card>
    </li>
  )
}
