import { useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { useNavigate } from '@tanstack/react-router'

interface ILogoutButtonProps {
  refetch: UseQueryResult['refetch']
}

export function LogoutButton({ refetch }: ILogoutButtonProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('Authorization')
    queryClient.removeQueries()
    refetch()
    navigate({ to: '/login' })
  }

  return (
    <Button className="ml-auto" onClick={handleLogout}>
      Logout
    </Button>
  )
}
