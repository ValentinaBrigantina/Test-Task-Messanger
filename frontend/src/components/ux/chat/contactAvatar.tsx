import { IUserAvatarProps, UserAvatar } from '../userAvatar'

export function ContactAvatar({ user }: IUserAvatarProps) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={user} />
      <p className="text-ellipsis overflow-hidden ...">{user.name}</p>
    </div>
  )
}
