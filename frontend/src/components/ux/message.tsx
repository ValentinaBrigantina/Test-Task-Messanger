import { Card, CardContent } from '@/components/ui/card'
import { UserAvatar } from './userAvatar'
import { MessageSchema } from '@server/sharedTypes'
import { formatDate, IDate } from '@/utils/helpers.ts/formatDate'

export interface IMessageSchema {
  messages: MessageSchema[]
}

export function Message({ messages }: IMessageSchema) {
  return (
    <div>
      <ul>
        {messages.map((message) => {
          const date: IDate = message.createdAt
            ? formatDate(message.createdAt)
            : { day: '', time: '' }
          return (
            <li className="my-1" key={message.id}>
              <Card className="bg-background flex px-2">
                <UserAvatar user={message.author} />
                <CardContent className="p-3 grow">{message.text}</CardContent>
                <div className="bg-background flex flex-none px-2 items-center">
                  <div className="flex flex-col content-center text-neutral-400">
                    <p className="text-xs">{date.time}</p>
                    <p className="text-xs">{date.day}</p>
                  </div>
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
