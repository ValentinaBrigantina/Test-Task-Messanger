import { Button } from '../ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { UserProfile } from '@server/sharedTypes'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export function HeaderProfile({ ...user }: UserProfile) {

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('Authorization')
    queryClient.invalidateQueries({ queryKey: ['get-current-user'] })
    navigate({ to: '/login' })
  }

  return (
    <div className="flex justify-between items-center w-full py-4 sm:max-w-sm m-auto">
      <div className="flex items-center gap-2">
        <Avatar>
          {user.avatar && (
            <AvatarImage src={user.avatar} alt={user.name} />
          )}
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
        <p>{user.name}</p>
      </div>
      <Button className="ml-auto" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
