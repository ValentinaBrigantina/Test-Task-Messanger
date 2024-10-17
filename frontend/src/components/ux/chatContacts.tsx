import { UserProfile } from '@server/sharedTypes'
import { Card, CardContent } from '../ui/card'
import { ContactAvatar } from './contactAvatar'

export interface IChatContactsProps {
  contacts: UserProfile[]
}

export function ChatContacts({ contacts = [] }: IChatContactsProps) {
  return (
    <div className="basis-1/4 flex-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h1 className="text-xl leading-9 tracking-tight text-gray-100">
              Contacts
            </h1>
          </div>
      <ul>
        {contacts.map((contact) => {
          return (
            <li className="my-1" key={contact.id}>
              <Card className='bg-background'>
                <CardContent className="p-3">
                  <ContactAvatar user={contact} />
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
      <div></div>
    </div>
  )
}
