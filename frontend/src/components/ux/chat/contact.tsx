import { useContext } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { UserProfile } from '@server/sharedTypes'
import { Card, CardContent } from '../../ui/card'
import { ContactAvatar } from './contactAvatar'
import { CurrentContactContext } from '@/routes/_authenticated/_chatLayout'
import { getChannelQueryOptions } from '@/lib/api'

interface IContactProps {
  contact: UserProfile
}

export function Contact({ contact }: IContactProps) {
  const navigate = useNavigate()
  const context = useContext(CurrentContactContext)
  const { data } = useQuery(getChannelQueryOptions({ id: contact.id }))

  const handleClick = () => {
    data && navigate({ to: `/chat/${data?.id}` })
  }

  const isCurrentContact = context?.currentTargetContact?.id === contact.id

  return (
    <li className="my-1" onClick={handleClick}>
      <Card
        className={`bg-background cursor-pointer rounded-md ${isCurrentContact ? 'border-2' : 'border-background'}`}
      >
        <CardContent className="p-3">
          <ContactAvatar user={contact} />
        </CardContent>
      </Card>
    </li>
  )
}
