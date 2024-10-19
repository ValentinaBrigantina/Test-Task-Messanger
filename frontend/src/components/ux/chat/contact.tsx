import { UserProfile } from '@server/sharedTypes'
import { Card, CardContent } from '../../ui/card'
import { ContactAvatar } from './contactAvatar'

interface IContactProps {
  contact: UserProfile,
}

export function Contact({ contact }: IContactProps) {
  return (
    <li className="my-1">
      <Card className="bg-background">
        <CardContent className="p-3">
          <ContactAvatar user={contact} />
        </CardContent>
      </Card>
    </li>
  )
}
