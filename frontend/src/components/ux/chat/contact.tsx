import { useContext } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { UserProfile } from '@server/sharedTypes'
import { Card, CardContent } from '../../ui/card'
import { ContactAvatar } from './contactAvatar'
import { getOrCreateChannel } from '@/lib/api'
import { CurrentContactContext } from '@/routes/_authenticated/_chatLayout'

interface IContactProps {
  contact: UserProfile
}

export function Contact({ contact }: IContactProps) {
  const navigate = useNavigate()
  const currentTargetContact = useContext(CurrentContactContext)

  const handleClick = async () => {
    const channelId = await getOrCreateChannel({ id: contact.id })
    navigate({ to: `/chat/${channelId.id}` })
  }

  const isCurrentContact = currentTargetContact?.id === contact.id

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
