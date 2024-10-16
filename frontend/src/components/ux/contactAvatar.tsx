import { IUserAvatarProps, UserAvatar } from './userAvatar'

export function ContactAvatar ({ user }: IUserAvatarProps) {
    return (
        <div className="flex items-center gap-2">
        <UserAvatar user={user}/>
        <p>{user.name}</p>
      </div>
    )
}