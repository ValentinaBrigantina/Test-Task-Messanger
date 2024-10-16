import { Card, CardContent } from '@/components/ui/card'
import { UserAvatar } from './userAvatar'
import { MessageSchema } from '@server/sharedTypes'

export interface IMessageSchema {
  messages: MessageSchema[]
}

export function Message({ messages }: IMessageSchema) {
 
  return (
    <div>
      <ul>
        {messages.map((message) => {
          return (
            <li className="my-1" key={message.id}>
              <Card className="bg-background">
                <UserAvatar user={message.authorID} />
                <CardContent className="p-3">{message.text}</CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
