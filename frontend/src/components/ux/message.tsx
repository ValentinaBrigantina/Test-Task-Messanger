import { Card, CardContent } from '@/components/ui/card'
import { UserAvatar } from './userAvatar'
import { MessageSchema } from '@server/sharedTypes'
import { formatDate } from '@/utils/helpers.ts/formatDate'

export interface IMessageSchema {
  messages: MessageSchema[]
}

export function Message({ messages }: IMessageSchema) {
  return (
    <div>
      <ul>
        {messages.map((message) => {
          const date = message.createdAt && formatDate(message.createdAt)
          return (
            <li className="my-1" key={message.id}>
              <Card className="bg-background flex px-2">
                <UserAvatar user={message.author} />
                <CardContent className="p-3 grow">{message.text}</CardContent>
                <div className="bg-background flex flex-none px-2 items-center">
                  <p>{date}</p>
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
