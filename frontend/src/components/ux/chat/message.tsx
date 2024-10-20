import { Card, CardContent } from '@/components/ui/card'
import { UserAvatar } from '../userAvatar'
import { MessageSchema } from '@server/sharedTypes'
import { IDate } from '@/utils/helpers.ts/formatDate'

export interface IMessageProps {
  message: MessageSchema
  date: IDate
}

export function Message({ message, date }: IMessageProps) {
  return (
    <li className="my-1">
      <Card className="bg-background border-background flex px-2">
        <UserAvatar user={message.author} />
        <CardContent className="p-3 grow">{message.text}</CardContent>
        <div className="bg-background flex flex-none px-2 items-center">
          <div className="flex flex-col content-center text-ring">
            <p className="text-xs">{date.time}</p>
            <p className="text-xs">{date.day}</p>
          </div>
        </div>
      </Card>
    </li>
  )
}
