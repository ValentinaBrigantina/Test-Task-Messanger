import { useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { useNavigate } from '@tanstack/react-router'

interface ILogoutButtonProps {
  refetch: UseQueryResult['refetch']
}

export function LogoutButton({ refetch }: ILogoutButtonProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    localStorage.removeItem('Authorization')
    queryClient.removeQueries()
    navigate({ to: '/authenticatedForm' })
    await refetch()
  }

  return (
    <Button className="ml-auto" onClick={handleLogout}>
      Logout
    </Button>
  )
}
