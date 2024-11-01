import { useContext } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { UserProfile } from '@server/sharedTypes'
import { Card, CardContent } from '../../ui/card'
import { ContactAvatar } from './contactAvatar'
import { getChannelQueryOptions } from '@/lib/api'
import { CurrentChannelContext } from '@/routes/_authenticated/_chatLayout'

interface IContactProps {
  contact: UserProfile
}

export function Contact({ contact }: IContactProps) {
  const navigate = useNavigate()
  const context = useContext(CurrentChannelContext)
  const { data: channel } = useQuery(getChannelQueryOptions({ id: contact.id }))

  const handleClick = async () => {
    context?.setCurrentTargetChannel &&
      channel &&
      context.setCurrentTargetChannel(channel)

    channel && navigate({ to: `/chat/${channel?.id}` })
  }

  const isCurrentChannel = context?.currentTargetChannel?.id === channel?.id

  return (
    <li className="my-1" onClick={handleClick}>
      <Card
        className={`bg-background cursor-pointer rounded-md ${isCurrentChannel ? 'border-2' : 'border-background'}`}
      >
        <CardContent className="p-3">
          <ContactAvatar user={contact} />
        </CardContent>
      </Card>
    </li>
  )
}
