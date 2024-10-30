import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import type { UserProfile } from '@server/sharedTypes';

export interface IUserAvatarProps {
    user: UserProfile
  }

export function UserAvatar({ user }: IUserAvatarProps) {
    return (
        <div className="flex items-center gap-2">
        <Avatar>
          {user.avatar && (
            <AvatarImage src={user.avatar} alt={user.name} />
          )}
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
      </div>
    )
}